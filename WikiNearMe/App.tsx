import { Linking, StyleSheet, Text, View, Image, ImageSourcePropType, ImageURISource } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
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
    let searchurl: string = ''.concat('https://en.wikipedia.org/w/api.php?action=query&format=json&pithumbsize=500&pilicense=any&prop=coordinates|pageimages&meta=&generator=geosearch&formatversion=2&colimit=100&coprop=globe&coprimary=primary&ggscoord=', centralLat, '|', centralLong, '&ggslimit=max&ggsradius=10000&ggsglobe=earth&ggsnamespace=0&ggsprop=globe&ggsprimary=primary');

    console.log(searchurl);

    axios.request({
      url: searchurl,
      method: 'GET',
    }).then((response: AxiosResponse) => response.data.query.pages)
      .then((articleData: any) => {
        articles.splice(0);
        let newArticles: Array<Article> = [];
        Object.keys(articleData || {}).forEach((key) => {
          let article = articleData[key];
          let newArticle: Article = {
            title: article.title,
            lat: article.hasOwnProperty('coordinates') ? article.coordinates[0].lat : -91,
            lon: article.hasOwnProperty('coordinates') ? article.coordinates[0].lon : -181,
            pageid: article.pageid,
            thumbnail: article.thumbnail ? { source: article.thumbnail.source, width: article.thumbnail.width, height: article.thumbnail.height } : undefined,
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
            description={e.title}>
            <Callout tooltip onPress={() => {
              console.log(e, typeof e.thumbnail?.source)
              Linking.openURL('https://en.wikipedia.org/wiki/' + e.title)
            }}>
              <View>
                <View style={styles.calloutBubble}>
                  <Text style={{}}>
                    {e.title}
                  </Text>
                  <Text>
                    <Image
                      source={typeof e.thumbnail === undefined ? require('./assets/Wikipedia-logo-transparent.png') : { uri: e.thumbnail?.source }}
                      style={{ width: 100, height: 100, resizeMode: 'cover' }}
                    />
                  </Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>
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
  calloutBubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  arrow: {
    backgroundColor: "transparent",
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "#fff",
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "#007a87",
    alignSelf: "center",
    marginTop: -0.5,
  },
});
