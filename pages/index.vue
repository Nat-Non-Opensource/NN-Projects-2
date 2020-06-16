<template>
  <div style="width: 100%; height: 100%;" class="noScroll">
    <v-app id="app">
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="auto" max-height="auto">
          <v-card>
            <v-card-actions>
              <v-btn color="white darken-2" @click="dialog = false">
                <v-icon dark>mdi-arrow-left</v-icon>Back
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            <!-- <v-card-subtitle>
              <p
                style="display: inline; color: rgb(210, 210, 210);"
                v-if="pact"
              >
                บริการ
              </p>
              <p style="display: inline; color: rgb(210, 210, 210);" v-else>
                ไม่บริการ
              </p>
            </v-card-subtitle> -->
            <v-card-text
              ><p v-if="ptype === 'alert'">
                <img src="~/assets/alert.png">
                Alert: แจ้งเตือนภัย
              </p>
              <p v-else-if="ptype === 'fire'">
                <img src="~/assets/fire.png">
                Fire: ไฟใหม้
              </p>
              <p v-else-if="ptype === 'radio'">
                <img src="~/assets/radio.png">
                Radio: วิทยุ
              </p>
              <p v-else-if="ptype === 'tree'">
                <img src="~/assets/tree.png">
                Tree: ต้นไม้
              </p>
              <p v-else>{{ ptype }}</p></v-card-text
            >
            <v-card-text> คำอธิบาย: </v-card-text>
            <v-card-text>
              <div class="pre-formatted">{{ pdesc }}</div>
            </v-card-text>
            <v-card-text>
              <a :href="'https://www.google.com/maps/dir//' + plat + ',' + plng"
                >นำทางไปที่ตำแหน่ง</a
              >
            </v-card-text>
            <v-card-text>
              Picture:
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <l-map
        :zoom.sync="zoom"
        :options="mapOptions"
        :center="center"
        :bounds="bounds"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        style="width: 100%; z-index: 100;"
      >
        <l-control-layers
          :position="layersPosition"
          :collapsed="false"
          :sort-layers="true"
        />
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :attribution="tileProvider.attribution"
          :url="tileProvider.url"
          layer-type="base"
        />
        <l-control-zoom :position="zoomPosition" />
        <l-control-attribution
          :position="attributionPosition"
          :prefix="attributionPrefix"
        />
        <l-control-scale :imperial="imperial" />
        <l-marker
          v-for="marker in markers"
          :key="marker.id"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :lat-lng.sync="marker.position"
          :icon="marker.icon"
        >
          <l-tooltip :content="marker.tooltip" />
          <l-popup :content="marker.tooltip" />
        </l-marker>
        <l-layer-group
          v-for="item in alert"
          :key="item.id"
          :visible.sync="item.visible"
          layer-type="overlay"
          name="Alert: แจ้งเตือนภัย"
        >
          <l-layer-group :visible="item.markersVisible">
            <l-marker
              v-for="marker in item.markers"
              :key="marker.id"
              :visible="marker.visible"
              :draggable="marker.draggable"
              :lat-lng="marker.position"
              :icon="iconAlert"
              @click="
                dialog = true;
                pname = marker.tooltip;
                ptype = marker.type;
                pdesc = marker.desc;
                plat = marker.position.lat;
                plng = marker.position.lng;
              "
              ><l-tooltip :content="marker.tooltip"
            /></l-marker>
          </l-layer-group>
        </l-layer-group>
        <l-layer-group
          v-for="item in fire"
          :key="item.id"
          :visible.sync="item.visible"
          layer-type="overlay"
          name="Fire: ไฟใหม้"
        >
          <l-layer-group :visible="item.markersVisible">
            <l-marker
              v-for="marker in item.markers"
              :key="marker.id"
              :visible="item.visible"
              :draggable="item.draggable"
              :lat-lng="marker.position"
              :icon="iconFire"
              @click="
                dialog = true;
                pname = marker.tooltip;
                ptype = marker.type;
                pdesc = marker.desc;
                plat = marker.position.lat;
                plng = marker.position.lng;
              "
            />
          </l-layer-group>
        </l-layer-group>
        <l-layer-group
          v-for="item in radio"
          :key="item.id"
          :visible.sync="item.visible"
          layer-type="overlay"
          name="Radio: วิทยุ"
        >
          <l-layer-group :visible="item.markersVisible">
            <l-marker
              v-for="marker in item.markers"
              :key="marker.id"
              :visible="marker.visible"
              :draggable="marker.draggable"
              :lat-lng="marker.position"
              :icon="iconRadio"
              @click="
                dialog = true;
                pname = marker.tooltip;
                ptype = marker.type;
                pdesc = marker.desc;
                plat = marker.position.lat;
                plng = marker.position.lng;
              "
            />
          </l-layer-group>
        </l-layer-group>
        <l-layer-group
          v-for="item in tree"
          :key="item.id"
          :visible.sync="item.visible"
          layer-type="overlay"
          name="Tree: ต้นไม้"
        >
          <l-layer-group :visible="item.markersVisible">
            <l-marker
              v-for="marker in item.markers"
              :key="marker.id"
              :visible="marker.visible"
              :draggable="marker.draggable"
              :lat-lng="marker.position"
              :icon="iconTree"
              @click="
                dialog = true;
                pname = marker.tooltip;
                ptype = marker.type;
                pdesc = marker.desc;
                plat = marker.position.lat;
                plng = marker.position.lng;
              "
            />
          </l-layer-group>
        </l-layer-group>
      </l-map>
    </v-app>
  </div>
</template>

<script>
import { latLngBounds, icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LLayerGroup,
  LTooltip,
  LPopup,
  LControlZoom,
  LControlAttribution,
  LControlScale,
  LControlLayers,
} from "vue2-leaflet";
import axios from "axios";

import * as firebase from "firebase/app";

import "firebase/analytics";
import "firebase/firestore";
import "firebase/firebase-functions";
import "~/plugins/firebase.js";

const markersAlert = [];
const markersFire = [];
const markersRadio = [];
const markersTree = [];

const tileProviders = [
  {
    name: "Open Street Map (Carto)",
    visible: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a>',
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  },
  {
    name: "Open Street Map (Default)",
    visible: false,
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    name: "Open Street Map (Gray)",
    visible: false,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    url:
      "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoicGF3YXQiLCJhIjoiY2s4cjBoMDM5MDUwMzNmcW45ZHd0YWppMyJ9.mEct1P_2b2sLI_5MBrpkRA",
  },
];
export default {
  name: "App",
  components: {
    L,
    LMap,
    LTileLayer,
    LMarker,
    LLayerGroup,
    LTooltip,
    LPopup,
    LControlZoom,
    LControlAttribution,
    LControlScale,
    LControlLayers,
  },
  mounted() {
    this.findFromFirestore();
  },
  created() {},
  methods: {
    async findFromFirestore() {
      try {
        // Alert
        firebase
          .firestore()
          .collection("geolocation")
          .where("type", "==", 0)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              markersAlert.push({
                position: {
                  lat: doc.data().loc.Rc,
                  lng: doc.data().loc.Ac,
                },
                tooltip: doc.data().name,
                type: "alert",
                visible: true,
                draggable: false,
              });
            });
          });

        // Fire
        firebase
          .firestore()
          .collection("geolocation")
          .where("type", "==", 1)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              markersFire.push({
                position: {
                  lat: doc.data().loc.Rc,
                  lng: doc.data().loc.Ac,
                },
                tooltip: doc.data().name,
                type: "fire",
                visible: true,
                draggable: false,
              });
            });
          });

        // Radio
        firebase
          .firestore()
          .collection("geolocation")
          .where("type", "==", 2)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              markersRadio.push({
                position: {
                  lat: doc.data().loc.Rc,
                  lng: doc.data().loc.Ac,
                },
                tooltip: doc.data().name,
                type: "radio",
                visible: true,
                draggable: false,
              });
            });
          });

        // Tree
        firebase
          .firestore()
          .collection("geolocation")
          .where("type", "==", 3)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              markersTree.push({
                position: {
                  lat: doc.data().loc.Rc,
                  lng: doc.data().loc.Ac,
                },
                tooltip: doc.data().name,
                type: "tree",
                visible: true,
                draggable: false,
              });
            });
          });
      } catch (e) {
        console.log(e);
        return;
      }
    },
  },
  data() {
    return {
      center: [18.7888595, 98.9846145],
      opacity: 0.6,
      tokens:
        "sk.eyJ1IjoicGF3YXQiLCJhIjoiY2s4cjBoMDM5MDUwMzNmcW45ZHd0YWppMyJ9.mEct1P_2b2sLI_5MBrpkRA",
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: true,
      },
      zoom: 13,
      minZoom: 0.5,
      maxZoom: 19,
      zoomPosition: "topright",
      attributionPosition: "bottomright",
      layersPosition: "topright",
      attributionPrefix: "",
      Positions: ["topleft", "topright", "bottomleft", "bottomright"],
      imperial: false,
      tileProviders: tileProviders,
      markers: [],
      dialog: false,
      pname: "",
      ptype: "",
      pdesc: "",
      plat: 0.0,
      plng: 0.0,
      pimg: "",
      alert: [
        {
          id: "alr",
          markers: markersAlert,
          visible: true,
          markersVisible: true,
        },
      ],
      fire: [
        {
          id: "fir",
          markers: markersFire,
          visible: true,
          markersVisible: true,
        },
      ],
      radio: [
        {
          id: "rad",
          markers: markersRadio,
          visible: true,
          markersVisible: true,
        },
      ],
      tree: [
        {
          id: "trb",
          markers: markersTree,
          visible: true,
          markersVisible: true,
        },
      ],
      iconAlert: icon({
        iconUrl: require("~/assets/alert.png"),
        iconSize: [36, 32],
        iconAnchor: [22, 36],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      }),
      iconFire: icon({
        iconUrl: require("~/assets/fire.png"),
        iconSize: [36, 32],
        iconAnchor: [22, 36],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      }),
      iconRadio: icon({
        iconUrl: require("~/assets/radio.png"),
        iconSize: [36, 32],
        iconAnchor: [22, 36],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      }),
      iconTree: icon({
        iconUrl: require("~/assets/tree.png"),
        iconSize: [36, 32],
        iconAnchor: [22, 36],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      }),
      bounds: latLngBounds(),
    };
  },
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    },
  },
};
</script>

<style>
* {
  font-family: Arial, Helvetica, sans-serif;
}
.pre-formatted {
  white-space: pre;
}
table {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
table td,
table th {
  border: 1px solid #ddd;
  padding: 8px;
}
table tr:nth-child(even) {
  background-color: #f2f2f2;
}
table tr:hover {
  background-color: #ddd;
}
table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4caf50;
  color: white;
}
</style>
