import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';
import {TimeService} from '../../time.service';
import { HttpClient } from '@angular/common/http';

const apiToken = environment.mapbox;
declare const omnivore: any;
declare const L: any;

const timeRaceSliderOptions: any = {
  position: 'bottomleft',
  min: 0,
  value: 0,
  step: 1,
  collapsed: false,
  increment: false,
  syncSlider: true,
  showValue: false
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

const heatDesc = {};

const points = [];
const cumdist = [];
const trackLayer = [];
let numTracks = 0;

@Injectable()
export class TrackService {
  constructor(private snackBar: MatSnackBar, private timeService: TimeService, private http: HttpClient) { }

  plotActivity(_map, race) {
    const { googleSatellite, googleStreets, mapboxDark, baseMaps } = this.setLayersOnMap();
    
    const map = L.map('map', {layers: [googleSatellite, googleStreets, mapboxDark]});
    map.locate({setView: true, maxZoom: 100});
    
    const layersControl = L.control.layers(baseMaps, null, {collapsed: false, position: 'bottomright'}).addTo(map);

    this.http.get(_map.gpx)
      .subscribe(
        (gpx) => {
          trackElevationControl.addTo(map);

          this.extractPoints(gpx);
          
          trackLayer[numTracks++] = new L.Polyline(points, {
            weight: 3,
            smoothFactor: 1
          });
          layersControl.addOverlay(trackLayer[numTracks - 1], race.name);
          map.addLayer(trackLayer[numTracks - 1]);
          map.fitBounds(trackLayer[numTracks - 1].getBounds());
          
          const { _race, numSteps } = this.initializeRaceVars(race);
          
          this.simulateRace(_race, numSteps);
          
          const timeRaceSlider = L.control.slider((value) => {
            const offset = Math.floor(_race.finishTime / (numSteps - 1));
            this.changeOfSliderLayer(map, value, offset);
          }, timeRaceSliderOptions).addTo(map);
          
        },
        (error) => {
          this.snackBar.open('Parece que hubo un problema con el mapa de calor, por favor recargue la página si desea verlo', '', {duration: 5000});
        }
      );
  }

  extractPoints(gpx) {
    L.geoJson(gpx, {
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
    heatDesc[this.format(0)] = this.createHeatLayer(startCoord);
    for (let index = offset; index <= race.finishTime; index += offset) {
      const {dist, runnerList} = this.calculateRunnerLocation(race.results, offset);
      const posInCumDist = this.calculateRunnerPositions(runnerList);
      const runnerCoords = this.indexToCoord(posInCumDist, dist);
      heatDesc[this.format(index)] = this.createHeatLayer(runnerCoords);
    }
  }

  createHeatLayer(coords) {
    return L.heatLayer(coords, {radius: 10, blur: 0, maxZoom: 8});
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

  format (secs) {
    return new Date(secs * 1000).toUTCString().substring(17, 25);
  }

  changeOfSliderLayer(map, value, offset) {
    const curLayerIndex = this.format(value * offset);
    if (prevLayerIndex !== -1) {
      if (map.hasLayer(currentLayer)) {
        map.removeLayer(currentLayer);
      }
    }
    map.addLayer(heatDesc[curLayerIndex]);
    prevLayerIndex = curLayerIndex;
    currentLayer = heatDesc[curLayerIndex];
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

  // fillCumdist(_latlngs) {
  //   const cumdist = [];
  //   _latlngs.forEach((lat, index) => {
  //     if (cumdist.length === 0) {
  //       cumdist.push(0);
  //     } else {
  //       cumdist.push(cumdist[cumdist.length - 1] + lat.distanceTo(_latlngs[index - 1]));
  //     }
  //   });
  //   return cumdist;
  // }
}
