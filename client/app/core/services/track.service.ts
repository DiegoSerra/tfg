import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {MatSnackBar, MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';
import {TimeService} from '../../time.service';
import {HttpClient} from '@angular/common/http';
import {SelectRunnerDialogComponent} from '../../main/content/race/show-race/select-runner-dialog/select-runner-dialog.component';

const apiToken = environment.mapbox;
declare const L: any;

const timeRaceSliderOptions: any = {
  position: 'bottomleft',
  min: 0,
  value: 0,
  step: 1,
  logo: '',
  collapsed: false,
  syncSlider: true,
  getValue: (value) => TrackService.format(value * 60)
};

const trackElevationControl = L.control.elevation({
  position: 'topright',
  useHeightIndicator: true,
  interpolation: 'linear',
  collapsed: true,
  theme: 'steelblue-theme'
});

let prevLayerIndex: any = -1;
let currentLayer = '';
let curLayerIndex = '';

const heatDesc = {};
const networkDesc = {};
const runnerDesc = {};
let myRunner = null;
const VIEW = {
  HEATMAP: 0,
  NETWORK: 1,
  RUNNER: 2
};
let runnerView = VIEW.HEATMAP;

const points = [];
const cumdist = [];
const trackLayer = [];
let numTracks = 0;

@Injectable()
export class TrackService {
  map: any;
  geoJson: any;

  loading = false;

  static format (secs) {
    return new Date(secs * 1000).toUTCString().substring(17, 25);
  }

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog, 
              private timeService: TimeService, 
              private http: HttpClient) { }

              

  plotActivity(_map, race) {
    this.loading = true;
    const { googleSatellite, googleStreets, mapboxDark, baseMaps } = this.setLayersOnMap();
    
    this.map = _map;
    this.map = L.map('map', {layers: [googleSatellite, googleStreets, mapboxDark]});
    this.map.locate({setView: true, maxZoom: 100});
    
    const layersControl = L.control.layers(baseMaps, null, {collapsed: false, position: 'bottomright'}).addTo(this.map);

    this.http.get(_map.gpx)
      .subscribe(
        (gpx) => {
          try {
            trackElevationControl.addTo(this.map);
  
            this.extractPoints(gpx);
            
            trackLayer[numTracks++] = new L.Polyline(points, {
              weight: 3,
              smoothFactor: 1
            });
            layersControl.addOverlay(trackLayer[numTracks - 1], race.name);
            this.map.addLayer(trackLayer[numTracks - 1]);
            this.map.fitBounds(trackLayer[numTracks - 1].getBounds());
            
            const { _race, numSteps } = this.initializeRaceVars(race);
            
            this.simulateRace(_race, numSteps);
            
            const timeRaceSlider = L.control.slider((value) => {
              const offset = Math.floor(_race.finishTime / (numSteps - 1));
              this.changeOfSliderLayer(value, offset);
            }, timeRaceSliderOptions).addTo(this.map);
            
            const centerOnTrackButton = L.easyButton({
              states: [
                {
                  stateName: 'located',
                  icon: 'fa-dot-circle-o fa-lg',
                  title: 'Centrar',
                  onClick: (control) => {
                    control.state('loading');
                    if (typeof trackLayer[0] !== 'undefined') {
                      this.map.flyToBounds(trackLayer[0].getBounds());
                    } else {
                      this.map.locate({setView: true, maxZoom: 15});
                    }
                    control.state('located');
                  }
                }, {
                  stateName: 'loading',
                  icon: 'fa-circle-o-notch fa-spin fa-lg'
                }]
            }).addTo(this.map);

            const networkViewButton = this.getLayerButton(_race).addTo(this.map);

            const runnerButton = this.getRunnerButton(_race).addTo(this.map);

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
        icon: 'fa-users fa-lg',
        stateName: 'heat',
        title: 'Ver densidad de corredores como mapa de calor',
        onClick: (control) => {
          this.clickOnHeatmapView(control);
        }
      }]
    });
    if (race.results.length > 200) {
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

  clickOnHeatmapView(control) {
    runnerView = VIEW.HEATMAP;
    control.state('network');
    this.map.removeLayer(networkDesc[curLayerIndex]);
    this.map.addLayer(heatDesc[curLayerIndex]);
    currentLayer = heatDesc[curLayerIndex];
  }
  
  clickOnNetworkView(control) {
    runnerView = VIEW.NETWORK;
    control.state('heat');
    this.map.removeLayer(heatDesc[curLayerIndex]);
    this.map.addLayer(networkDesc[curLayerIndex]);
    currentLayer = networkDesc[curLayerIndex];
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
          runnerDesc[key] = this.createHeatLayer(heatDesc[key]._latlngs.filter((item, index) => index === myRunner.position - 1));
        });
        this.map.removeLayer(currentLayer);
        this.map.addLayer(runnerDesc[curLayerIndex]);
        currentLayer = runnerDesc[curLayerIndex];
      }
    });
  }

  extractPoints(gpx) {
    this.geoJson = L.geoJson(gpx, {
      onEachFeature: (feature, layer) => {
        trackElevationControl.addData(feature, layer);
        trackElevationControl.addData.bind(trackElevationControl);
      },
      coordsToLatLng: (coords) => {
        const newPoint = new L.LatLng(coords[1], coords[0], coords[2]);
        if (points.length === 0) {
          points.push(newPoint);
          cumdist.push(0);
        } else {
          cumdist.push(cumdist[cumdist.length - 1] + newPoint.distanceTo(points[points.length - 1]));
          points.push(newPoint);
        }
      }
    });
  }

  initializeRaceVars(race) {
    const totalTimes = race.results.map((result) => result.time);
    const lastClassifiedTime = Math.max(...totalTimes);
    const _race = {...race};
    _race.finishTime = lastClassifiedTime;
    const numSteps = Math.ceil(lastClassifiedTime / 60);
    timeRaceSliderOptions.max = numSteps - 1;
    return { _race, numSteps };
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

  simulateRace(race, numSteps) {
    const offset = Math.floor(race.finishTime / (numSteps - 1));
    const startCoord = Array(race.results.length).fill(points[0]);
    heatDesc[TrackService.format(0)] = this.createHeatLayer(startCoord);
    if (race.results.length <= 200) {
      networkDesc[TrackService.format(0)] = this.createNetworkLayer(startCoord, 20, true);
    }
    for (let index = offset; index <= race.finishTime; index += offset) {
      const {dist, runnerList} = this.calculateRunnerLocation(race.results, offset);
      const posInCumDist = this.calculateRunnerPositions(runnerList);
      const runnerCoords = this.indexToCoord(posInCumDist, dist);
      heatDesc[TrackService.format(index)] = this.createHeatLayer(runnerCoords);
      if (race.results.length <= 200) {
        networkDesc[TrackService.format(index)] = this.createNetworkLayer(runnerCoords, 20, true);
      }
    }
  }

  createHeatLayer(coords) {
    return L.heatLayer(coords, {radius: 10, blur: 0, maxZoom: 8});
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
    while (i < cumdist.length - 1 && cumdist[i] < runner.dist) {
      i++;
    }
    runner.pos = i;
  }

  indexToCoord(index, dist) {
    const coords = [];
    for (let i = 0; i < index.length; i++) {
      coords[i] = this.interpolate(points, index[i], dist[i] - cumdist[index[i]]);
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
    if (d === 0 || i >= cumdist.length - 1) {
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
      if (this.map.hasLayer(currentLayer)) {
        this.map.removeLayer(currentLayer);
      }
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
      this.map.removeLayer(this.geoJson);
    }
  }
}
