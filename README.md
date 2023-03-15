# Wiki Near Me
This is an application I am creating that allows the user to see locations with Wikipedia articles near them. I am making this application for two reasons:
1. To create my first ever React Native application
2. I love Wikipedia

### Todo:
* Make it more obvious to the user they can click the callout to go to the Wikipedia page
 * Give the user the option to choose between viewing the Wikipedia page or getting directions to the location
* Display more information/images, if possible. (Images sources are received from the API. However, you can only use local images. Will need to find a workaround)
* Find distance displayed on the map to avoid making requests for articles that will not be within the range
  * This will speed up requests to the API as we will not be asking for pages that can't be displayed on the map
* Cluster markers together for high density areas/ when you zoom out
