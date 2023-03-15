import { Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import axios, { AxiosResponse } from 'axios';
import { Article } from './datatypes';
import React, { SetStateAction, useState } from 'react';


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
    let searchurl: string = ''.concat('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=coordinates|pageimages&meta=&generator=geosearch&formatversion=2&colimit=100&coprop=globe&coprimary=primary&ggscoord=', centralLat, '|', centralLong, '&ggslimit=max&ggsradius=10000&ggsglobe=earth&ggsnamespace=0&ggsprop=globe&ggsprimary=primary');

    console.log(searchurl);

    axios.request({
      url: searchurl,
      method: 'GET',
    }).then((response: AxiosResponse) => response.data.query.pages)
      .then((articleData: any) => {
        articles.splice(0);
        let newArticles: Array<Article> = [];
        Object.keys(articleData || {}).forEach((key) => {
          console.log(key);
          let article = articleData[key];
          let newArticle: Article = {
            title: article.title,
            lat: article.hasOwnProperty('coordinates') ? article.coordinates[0].lat : -91,
            lon: article.hasOwnProperty('coordinates') ? article.coordinates[0].lon : -181,
            pageid: article.pageid,
            thumbnail: article.thumbnail ? article.thumbnail.source : undefined,
          };
          if (newArticle.lat == -91 || newArticle.lon == -181) {
            return;
          }
          newArticles.push(newArticle);
        });
        setArticles(newArticles);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const onRegionChangeComplete = (newRegion: SetStateAction<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }>) => {
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{ ...StyleSheet.absoluteFillObject, }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        onMapReady={() => {
          let coor = getCentralCoordinates(region)
          centralCoordinates = coor
          findArticles()
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
            onCalloutPress={() => {
              console.log(e.title)
              Linking.openURL('https://en.wikipedia.org/wiki/' + e.title)
            }}
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
