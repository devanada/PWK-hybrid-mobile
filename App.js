import React, { Component } from "react";
import { Dimensions, Text, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  Polygon,
  Geojson,
  Alert,
} from "react-native-maps";
import TestingGeoJson from "./TestingGeoJson";

const { width, height } = Dimensions.get("window");

const myPlace = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [125.6, 10.1],
      },
      properties: {
        name: "Dinagat Islands",
      },
    },
  ],
};

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      region: {
        latitude: 24.80855120296181,
        longitude: 67.03557014465332,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5 * (width / height),
      },
      polygons: [
        {
          coordinates: [
            { latitude: 24.80855120296181, longitude: 67.03557014465332 },
            { latitude: 24.805493205908192, longitude: 67.04031229019165 },
            { latitude: 24.802298784481714, longitude: 67.03735113143921 },
            { latitude: 24.80459721795997, longitude: 67.03323125839233 },
          ],
          color: "blue",
          open: false,
        },
        {
          coordinates: [
            { latitude: 24.80642814294996, longitude: 67.04509735107422 },
            { latitude: 24.80284417933238, longitude: 67.04968929290771 },
            { latitude: 24.800136659859945, longitude: 67.04707145690918 },
            { latitude: 24.803759658152476, longitude: 67.0425009727478 },
          ],
          color: "green",
          open: false,
        },
        {
          coordinates: [
            { latitude: 24.800837893597965, longitude: 67.04607367515564 },
            { latitude: 24.79905558341104, longitude: 67.04832673072815 },
            { latitude: 24.79590969472415, longitude: 67.04537630081177 },
            { latitude: 24.797769966717116, longitude: 67.04296231269836 },
          ],
          color: "red",
          open: false,
        },
      ],
      testState: TestingGeoJson.testingJson,
    };
  }

  async componentDidMount() {
    await this.fetchJson();
  }

  async fetchJson() {
    await fetch("https://api.jsonbin.io/b/5f9f8417ce4aa228955455bf")
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        try {
          const data = responseJson;
          this.setState({ dataFetch: data });
        } catch ({ message }) {
          console.log(message);
          Alert.alert("", "Terjadi kesalahan pada aplikasi");
        }
      })
      .catch((error) => {
        console.log("catch");
        console.log(error);
        Alert.alert("", "Terjadi kesalahan mengambil data banner");
      });
  }

  toggle(polygon) {
    console.log("onPress", polygon.open);

    if (polygon.open) {
      polygon.marker.hideCallout();
    } else {
      polygon.marker.showCallout();
    }

    polygon.open = !polygon.open;
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={this.state.region}>
          {this.state.polygons.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                fillColor={polygon.color}
                tappable={true}
                onPress={() => this.toggle(polygon)}
              />
              <Marker
                ref={(ref) => (polygon.marker = ref)}
                coordinate={polygon.coordinates[0]}
              >
                <Callout>
                  <Text>Hello!</Text>
                </Callout>
              </Marker>
            </View>
          ))}
          <Geojson
            geojson={this.state.testState}
            strokeColor="red"
            fillColor="green"
            strokeWidth={2}
          />
        </MapView>
      </View>
    );
  }
}

const styles = {
  container: {
    alignItems: "stretch",
    flex: 1,
  },
  map: {
    flex: 1,
  },
};
