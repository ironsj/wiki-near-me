import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import axios, { AxiosResponse } from 'axios';

export default function App() {
  let centralCoordinates = {
    latitude: '',
    longitude: '',
  }

  function getCentralCoordinates(region: Region) {
    console.log(region.latitude, region.longitude)
    return {
      longitude: region.longitude.toString(),
      latitude: region.latitude.toString(),
    };
  }

  const findArticles = (coordinates: any) => {
    let centralLat: string = centralCoordinates.latitude;
    let centralLong: string = centralCoordinates.longitude;
    let searchurl: string = ''.concat('https://en.wikipedia.org/w/api.php?action=query&gscoord=', centralLat, '|', centralLong, '&gslimit=1&gsradius=10000&list=geosearch&format=json');

    axios.request({
      url: searchurl,
      method: 'GET',
    }).then((response: AxiosResponse) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ ...StyleSheet.absoluteFillObject, }}
        provider={undefined}
        showsUserLocation={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        onRegionChange={(region) => {
          let coor = getCentralCoordinates(region)
          centralCoordinates = coor
          console.log(centralCoordinates)
        }}
        onRegionChangeComplete={() => {
          findArticles(centralCoordinates)
        }}
      >
        <Marker
          onPress={() => {
            getCentralCoordinates;
          }}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="My Marker"
          description="Some description"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
