const fs = require( 'fs-extra' ),
      path = require( 'path' ),
      Twit = require( 'twit' ),
      CronJob = require ( 'cron' ).CronJob,
      dotenv = require ( 'dotenv' )
      config = require( path.join( __dirname, 'config.js' ) );

dotenv.config()

const T = new Twit( config );

function randomEmoji(){
  var emojiArray = ['💙', '🥶', '🦋', '🧢', '🚙', '🔵', '👖', '👕', '🔹', '🌀', '🧵', '🟦', '📘', '🏧']; // add whatever text you want here
  return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

function randomFromArray(images){
  return images[Math.floor(Math.random() * images.length)];
}

function tweetRandomImage(){
  fs.readdir( __dirname + '/images', function( err, files ) {
    if ( err ){
      console.log( 'error:', err );
    }
    else {
      let images = [];
      files.forEach( function( f ) {
        images.push( f );
      } );

      console.log( 'opening an image...' );
      var selectedImage = randomFromArray(images)
      const imagePath = path.join( __dirname, '/images/' + selectedImage ),
        b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );

      console.log( 'uploading an image...' );

      T.post( 'media/upload', { 
        media_data: b64content
        }, function ( err, data, response ) {
        if ( err ){
          console.log( 'error:', err );
        }
        else {
          const image = data;
          console.log( 'image uploaded, adding description...' );

          T.post( 'media/metadata/create', {
            media_id: image.media_id_string,
            alt_text: {
              text: ''
            }            
          }, function( err, data, response ){
            console.log( 'tweeting the image...' ); 
            
            T.post( 'statuses/update', {
              status: randomEmoji(),
              media_ids: [image.media_id_string]
            },
              function( err, data, response) {
                if (err){
                  console.log( 'error:', err );
                }
                else {
                  console.log( 'posted an image!' );

                  fs.move(`./images/${selectedImage}`, `./images/used/${selectedImage}`, err => {
                    if (err) return console.error(err)
                    console.log('image archived!')
                  })
                }
              }
            );
          } );
        }
      });      
    }
  });
}

const job = new CronJob("27,58 * * * *", () => {
    console.log('cronjob is running')
    tweetRandomImage()
})

job.start();