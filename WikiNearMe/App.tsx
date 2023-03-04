import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import axios, { AxiosResponse } from 'axios';
import { Article } from './datatypes';
import { SetStateAction, useState } from 'react';

export default function App() {
  let centralCoordinates = {
    latitude: '',
    longitude: '',
  }

  let [articles, setArticles] = useState(Array<Article>());

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  function getCentralCoordinates(region: Region) {
    console.log(region.latitude, region.longitude)
    return {
      longitude: region.longitude.toString(),
      latitude: region.latitude.toString(),
    };
  }

  const findArticles = () => {
    let centralLat: string = centralCoordinates.latitude;
    let centralLong: string = centralCoordinates.longitude;
    let searchurl: string = ''.concat('https://en.wikipedia.org/w/api.php?action=query&gscoord=', centralLat, '|', centralLong, '&gslimit=50&gsradius=10000&list=geosearch&format=json');

    console.log(searchurl);

    axios.request({
      url: searchurl,
      method: 'GET',
    }).then((response: AxiosResponse) => response.data.query.geosearch)
      .then((articleData: any) => {
        articles.splice(0);
        let newArticles = [];
        newArticles.push(...articleData);
        setArticles(newArticles);
        console.log(articles)
      });
  }

  const onRegionChangeComplete = (newRegion: SetStateAction<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }>) => {
    setRegion(newRegion);
  };

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
          findArticles()
          onRegionChangeComplete
        }}
      >
        {articles.map((e: Article) => (
          <Marker
            key={e.title}
            coordinate={{ latitude: e.lat, longitude: e.lon }}
            title={e.title}
            description={e.title}
          />
        ))}
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
