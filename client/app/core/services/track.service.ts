import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {MatSnackBar, MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';
import {TimeService} from '../../time.service';
import {HttpClient} from '@angular/common/http';
import {SelectRunnerDialogComponent} from '../../main/content/race/show-race/select-club-dialog/select-runner-dialog.component';
import {SelectClubDialogComponent} from '../../main/content/race/show-race/select-runner-dialog/select-club-dialog.component';
import {Subject} from 'rxjs/Subject';

const apiToken = environment.mapbox;
declare const L: any;

// const timeRaceSliderOptions: any = {
//   position: 'bottomleft',
//   min: 0,
//   value: 0,
//   step: 1,
//   logo: '',
//   collapsed: false,
//   syncSlider: true,
//   getValue: (value) => TrackService.format(value * 60)
// };

const trackElevationControl = L.control.elevation({
  position: 'topright',
  useHeightIndicator: true,
  interpolation: 'linear',
  collapsed: true,
  theme: 'steelblue-theme'
});

let prevLayerIndex: any = -1;
let currentLayer = '';
let curLayerIndex = '00:00:00';

const heatDesc = {};
const networkDesc = {};
const runnerDesc = {};
let myRunner = null;
let club = null;
const VIEW = {
  HEATMAP: 0,
  NETWORK: 1,
  RUNNER: 2,
  CLUB: 3
};
let runnerView = VIEW.HEATMAP;

@Injectable()
export class TrackService {
  map: any;
  geoJson: any;

  loading = false;
  numSteps = -1;

  points: any[] = [];
  cumdist: any[] = [];
  trackLayer: any[] = [];

  numTracks = 0;

  onNumStepsChange = new Subject<any>();
  onRunnerViewChange = new Subject<any>();
  onRunnerValueChange = new Subject<any>();

  static format (secs) {
    return new Date(secs * 1000).toUTCString().substring(17, 25);
  }

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog, 
              private timeService: TimeService, 
              private http: HttpClient) {
    this.points = [];
    this.cumdist = [];
    this.trackLayer = [];
  }

              

  plotActivity(_map, race) {
    this.loading = true;
    const { googleSatellite, googleStreets, mapboxDark, baseMaps } = this.setLayersOnMap();
    
    this.map = L.map('map', {layers: [googleSatellite, googleStreets, mapboxDark]});
    this.map.locate({setView: true, maxZoom: 100});
    
    const layersControl = L.control.layers(baseMaps, null, {collapsed: false, position: 'bottomright'}).addTo(this.map);

    this.http.get(_map.gpx)
      .subscribe(
        (gpx) => {
          try {
            trackElevationControl.addTo(this.map);
  
            this.extractPoints(gpx);           
            
            this.trackLayer[this.numTracks++] = new L.Polyline(this.points, {
              weight: 3,
              smoothFactor: 1
            });

            layersControl.addOverlay(this.trackLayer[this.numTracks - 1], race.name);
            this.map.addLayer(this.trackLayer[this.numTracks - 1]);
            this.map.fitBounds(this.trackLayer[this.numTracks - 1].getBounds());
            
            const _race = this.initializeRaceVars(race);
            
            this.simulateRace(_race);
            
            this.map.flyToBounds(this.trackLayer[0].getBounds());
            
            // const timeRaceSlider = L.control.slider((value) => {
            //   const offset = Math.floor(_race.finishTime / (this.numSteps - 1));
            //   this.changeOfSliderLayer(value, offset);
            // }, timeRaceSliderOptions).addTo(this.map);
            
            const centerOnTrackButton = this.getCenterButton().addTo(this.map);

            const networkViewButton = this.getLayerButton(_race).addTo(this.map);

            const runnerButton = this.getRunnerButton(_race).addTo(this.map);
            const clubButton = this.getClubButton(_race).addTo(this.map);

            currentLayer = heatDesc[curLayerIndex];
            this.loading = false;
          } catch (error) {
            this.loading = false;
            console.log(error);
            this.snackBar.open('Parece que hubo un problema con el mapa de calor, por favor recargue la página si desea verlo', '', {duration: 5000});
          }
        },
        (error) => {
          this.loading = false;
          this.snackBar.open('Parece que hubo un problema con el mapa de calor, por favor recargue la página si desea verlo', '', {duration: 5000});
        }
      );
  }

  getCenterButton() {
    return L.easyButton({
      states: [
        {
          stateName: 'located',
          icon: 'fa-dot-circle-o fa-lg',
          title: 'Centrar',
          onClick: (control) => {
            control.state('loading');
            if (typeof this.trackLayer[0] !== 'undefined') {
              this.map.flyToBounds(this.trackLayer[0].getBounds());
            } else {
              this.map.locate({setView: true, maxZoom: 15});
            }
            control.state('located');
          }
        }, {
          stateName: 'loading',
          icon: 'fa-circle-o-notch fa-spin fa-lg'
        }]
    });
  }

  getLayerButton(race) {
    const layerButton = L.easyButton({
      states: [{
        icon: 'fa-share-alt fa-lg',
        stateName: 'network',
        title: 'Ver corredores como red',
        onClick: (control) => {
          this.clickOnNetworkView(control);
        }
      }, {
        icon: 'fa-heartbeat fa-lg',
        stateName: 'heat',
        title: 'Ver densidad de corredores como mapa de calor',
        onClick: (control) => {
          this.clickOnHeatmapView(control);
        }
      }]
    });
    if (race.results.length > 300) {
      layerButton.disable();
    }
    return layerButton;
  }

  getRunnerButton(race) {
    return L.easyButton({
      states: [{
        icon: 'fa-street-view fa-lg',
        stateName: 'tie',
        title: 'Seguir a un corredor',
        onClick: (control) => {
          this.clickOnLockRunner(control, race);
        }
      }, {
        icon: 'fa-times fa-lg',
        stateName: 'untie',
        title: 'Dejar de seguir al corredor',
        onClick: (control) => {
          this.clickOnUnlockRunner(control);
        }
      }]
    });
  }

  getClubButton(race) {
    return L.easyButton({
      states: [{
        icon: 'fa-users fa-lg',
        stateName: 'tie',
        title: 'Seguir a un club',
        onClick: (control) => {
          this.clickOnLockClub(control, race);
        }
      }, {
        icon: 'fa-times fa-lg',
        stateName: 'untie',
        title: 'Dejar de seguir al club',
        onClick: (control) => {
          this.clickOnUnlockClub(control);
        }
      }]
    });
  }

  clickOnHeatmapView(control) {
    runnerView = VIEW.HEATMAP;
    control.state('network');
    this.map.removeLayer(networkDesc[curLayerIndex]);
    this.map.addLayer(heatDesc[curLayerIndex]);
    currentLayer = heatDesc[curLayerIndex];
    this.onRunnerViewChange.next(runnerView);
    this.onRunnerValueChange.next();
  }
  
  clickOnNetworkView(control) {
    runnerView = VIEW.NETWORK;
    control.state('heat');
    this.map.removeLayer(heatDesc[curLayerIndex]);
    this.map.addLayer(networkDesc[curLayerIndex]);
    currentLayer = networkDesc[curLayerIndex];
    this.onRunnerViewChange.next(runnerView);
    this.onRunnerValueChange.next();
  }
  
  clickOnLockRunner(control, race) {
    this.openSelectRunnerDialog(control, race);
  }
  
  clickOnUnlockRunner(control) {
    runnerView = VIEW.HEATMAP;
    control.state('tie');
    this.map.removeLayer(runnerDesc[curLayerIndex]);
    this.map.addLayer(heatDesc[curLayerIndex]);
    currentLayer = heatDesc[curLayerIndex];
    this.onRunnerViewChange.next(runnerView);
    this.onRunnerValueChange.next();
  }

  clickOnLockClub(control, race) {
    this.openSelectClubDialog(control, race);
  }
  
  clickOnUnlockClub(control) {
    runnerView = VIEW.HEATMAP;
    control.state('tie');
    this.map.removeLayer(runnerDesc[curLayerIndex]);
    this.map.addLayer(heatDesc[curLayerIndex]);
    currentLayer = heatDesc[curLayerIndex];
    this.onRunnerViewChange.next(runnerView);
    this.onRunnerValueChange.next(); 
  }

  openSelectRunnerDialog(control, race) {
    const dialogRef = this.dialog.open(SelectRunnerDialogComponent,
      {data: { race }}
    );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        myRunner = data;
        runnerView = VIEW.RUNNER;
        control.state('untie');
        Object.keys(heatDesc).forEach(key => {
          runnerDesc[key] = this.createHeatLayer(heatDesc[key]._latlngs.filter((item, index) => index === myRunner.position - 1), 10, {0.4: 'pink', 0.65: 'pink', 1: 'pink'});
        });
        // this.map.removeLayer(currentLayer);
        this.map.addLayer(runnerDesc[curLayerIndex]);
        currentLayer = runnerDesc[curLayerIndex];
        this.onRunnerViewChange.next(runnerView);
        this.onRunnerValueChange.next(myRunner.runnerName);
      }
    });
  }

  openSelectClubDialog(control, race) {
    const dialogRef = this.dialog.open(SelectClubDialogComponent,
      {data: { race }}
    );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        club = data;
        runnerView = VIEW.CLUB;
        control.state('untie');
        const positionsOnClub = race.results
          .filter(runner => runner.club === club)
          .map(runner => runner.position);

        Object.keys(heatDesc).forEach(key => {
          runnerDesc[key] = this.createHeatLayer(heatDesc[key]._latlngs.filter((item, index) => positionsOnClub.includes(index - 1)), 10, {0.4: 'pink', 0.65: 'pink', 1: 'pink'});
        });
        // this.map.removeLayer(currentLayer);
        this.map.addLayer(runnerDesc[curLayerIndex]);
        currentLayer = runnerDesc[curLayerIndex];
        this.onRunnerViewChange.next(runnerView);
        this.onRunnerValueChange.next(club);
      }
    });
  }

  extractPoints(gpx) {
    this.points = [];
    this.cumdist = [];
    this.geoJson = L.geoJson(gpx, {
      onEachFeature: (feature, layer) => {
        trackElevationControl.addData(feature, layer);
        trackElevationControl.addData.bind(trackElevationControl);
      },
      coordsToLatLng: (coords) => {
        const newPoint = new L.LatLng(coords[1], coords[0], coords[2]);
        if (this.points.length === 0) {
          this.points.push(newPoint);
          this.cumdist.push(0);
        } else {
          this.cumdist.push(this.cumdist[this.cumdist.length - 1] + newPoint.distanceTo(this.points[this.points.length - 1]));
          this.points.push(newPoint);
        }
      }
    });
  }

  initializeRaceVars(race) {
    const totalTimes = race.results.map((result) => result.time);
    const lastClassifiedTime = Math.max(...totalTimes);
    const _race = {...race};
    _race.finishTime = lastClassifiedTime;
    this.numSteps = Math.ceil(lastClassifiedTime / 60);
    this.onNumStepsChange.next(this.numSteps);
    // timeRaceSliderOptions.max = this.numSteps - 1;
    return _race;
  }

  setLayersOnMap() {
    const GOOGLE_TILES = 'http://{s}.google.com/vt/lyrs={type}&x={x}&y={y}&z={z}';
    const googleStreets = L.tileLayer(GOOGLE_TILES, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      type: 'm'
    });
    const googleSatellite = L.tileLayer(GOOGLE_TILES, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      type: 's'
    });
    const googleTerrain = L.tileLayer(GOOGLE_TILES, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      type: 'p'
    });
    const mapboxDark = L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      // tslint:disable-next-line:max-line-length
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.dark',
      accessToken: apiToken
    });

    const baseMaps = {
      'satellite': googleSatellite,
      'roadmap': googleStreets,
      'dark': mapboxDark
    };
    return { googleSatellite, googleStreets, mapboxDark, baseMaps };
  }

  simulateRace(race) {
    const offset = Math.floor(race.finishTime / (this.numSteps - 1));
    const startCoord = Array(race.results.length).fill(this.points[0]);
    heatDesc[TrackService.format(0)] = this.createHeatLayer(startCoord);
    if (race.results.length <= 300) {
      networkDesc[TrackService.format(0)] = this.createNetworkLayer(startCoord, 20, true);
    }
    for (let index = offset; index <= race.finishTime; index += offset) {
      const {dist, runnerList} = this.calculateRunnerLocation(race.results, offset);
      const posInCumDist = this.calculateRunnerPositions(runnerList);
      const runnerCoords = this.indexToCoord(posInCumDist, dist);
      heatDesc[TrackService.format(index)] = this.createHeatLayer(runnerCoords);
      if (race.results.length <= 300) {
        networkDesc[TrackService.format(index)] = this.createNetworkLayer(runnerCoords, 20, true);
      }
    }
  }

  createHeatLayer(coords, radius = 10, gradient = {0.4: 'blue', 0.65: 'lime', 1: 'red'}) {
    return L.heatLayer(coords, {radius, blur: 0, maxZoom: 8, gradient});
  } 

  createNetworkLayer(coords, maxDist, includeLinks) {
    let node = new L.circleMarker(coords[0], {radius: 5});
    const nodeList = [];
    nodeList.push(node);
    const linkList = [];
    for (let id = 1; id < coords.length; id++) {
      node = new L.circleMarker(this.noisy(coords[id]), {radius: 5});
      if (includeLinks) {
        let it = id - 1;
        while (it >= 0 && node.getLatLng().distanceTo(nodeList[it].getLatLng()) <= maxDist) {
          const link = [nodeList[it].getLatLng(), node.getLatLng()];
          linkList.push(link);
          it--;
        }
      }
      nodeList.push(node);
    }
    const network = L.layerGroup(nodeList);
    if (includeLinks) {
      const groupedLinks = new L.polyline(linkList, {
        color: 'black',
        weight: 2,
        smoothFactor: 1
      });
      network.addLayer(groupedLinks);
    }
    return network;
  }

  calculateRunnerLocation(runnerList, t) {
    const dist = [];
    runnerList.forEach((runner, index) => {
      let timeFromStart = t;
      if (timeFromStart < 0) {
        timeFromStart = 0;
      }
      runner.vel = 1000 / runner.rhythm;
      dist[index] = (runner.dist || 0) + timeFromStart * runner.vel;
      runner.dist = dist[index];
    });
    return {dist, runnerList};
  }

  calculateRunnerPositions(runnerList) {
    runnerList.forEach(runner => {
      this.moveRunnerToNextPos(runner);
    });
    return runnerList.map((runner) => runner.pos);
  }
  
  moveRunnerToNextPos(runner) {
    let i = runner.pos || 0;
    while (i < this.cumdist.length - 1 && this.cumdist[i] < runner.dist) {
      i++;
    }
    runner.pos = i;
  }

  indexToCoord(index, dist) {
    const coords = [];
    for (let i = 0; i < index.length; i++) {
      coords[i] = this.interpolate(this.points, index[i], dist[i] - this.cumdist[index[i]]);
    }
    return coords;
  }

  noisy(coords) {
    const disp = (Math.random() * 2 - 1) / 1000000;
    const modified = new L.latLng(coords.lat * (1 + disp), coords.lng * (1 + disp));
    return modified;
  }

  interpolate (p, i, d) {
    let interpolatedDist = p[i];
    if (d === 0 || i >= this.cumdist.length - 1) {
      return interpolatedDist;
    } else {
      // distance in km
      d /= 1000;
      // pendiente
      let m;
      if (p[i + 1].lat !== p[i].lat) {
        m = (p[i + 1].lng - p[i].lng) / (p[i + 1].lat - p[i].lat);
      } else {
        m = Number.MAX_VALUE;
      }
      // angle of the segment
      let theta = Math.atan(m);
      if (p[i].lat > p[i + 1].lat) {
        theta += Math.PI;
      }
      interpolatedDist = this.destinationPoint(p[i].lat, p[i].lng, this.toDeg(theta), d);
    }
    return interpolatedDist;
  }

  toDeg (numberInRadians) {
    return numberInRadians * 180 / Math.PI;
  }

  toRad (numberInDegrees) {
    return numberInDegrees * Math.PI / 180;
  }

  changeOfSliderLayer(value, offset) {
    curLayerIndex = TrackService.format(value * offset);
    if (prevLayerIndex !== -1) {
      this.map.eachLayer(layer => {
        if (layer._latlngs && layer._bounds === undefined) {
          this.map.removeLayer(layer);
        }
      });
    }
    if (runnerView === VIEW.HEATMAP) {
      this.map.addLayer(heatDesc[curLayerIndex]);
      prevLayerIndex = curLayerIndex;
      currentLayer = heatDesc[curLayerIndex];
    } else if (runnerView === VIEW.NETWORK) {
      this.map.addLayer(networkDesc[curLayerIndex]);
      prevLayerIndex = curLayerIndex;
      currentLayer = networkDesc[curLayerIndex];
    } else {
      this.map.addLayer(heatDesc[curLayerIndex]);
      this.map.addLayer(runnerDesc[curLayerIndex]);
      prevLayerIndex = curLayerIndex;
      currentLayer = runnerDesc[curLayerIndex];
    }
  }

  destinationPoint(lat, lng, bearingInDeg, distanceInMeters) {
    const DIAMETER_OF_EARTH = 6378.137;
    const distFraction = distanceInMeters / DIAMETER_OF_EARTH;
    const bearingInRad = this.toRad(bearingInDeg);
    const lat1 = this.toRad(lat);
    const lon1 = this.toRad(lng);
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distFraction) +
      Math.cos(lat1) * Math.sin(distFraction) * Math.cos(bearingInRad));
    const lon2 = lon1 + Math.atan2(
      Math.sin(bearingInRad) * Math.sin(distFraction) * Math.cos(lat1),
      Math.cos(distFraction) - Math.sin(lat1) * Math.sin(lat2));
    if (isNaN(lat2) || isNaN(lon2)) {
      return null;
    }
    return new L.LatLng(this.toDeg(lat2), this.toDeg(lon2));
  }

  clearGeoJson() {
    if (this.map) {
      this.map.eachLayer(layer => this.map.removeLayer(layer));
      this.trackLayer = [];
      this.numTracks = 0;
    }
  }
}
