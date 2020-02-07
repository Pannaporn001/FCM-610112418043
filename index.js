const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('fcm-a4cd8-firebase-adminsdk-q81sl-bf64ec1dbf.json')
const databaseURL = 'https://fcm-a4cd8.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-a4cd8/messages:send'
const deviceToken =
  'fC_rGPj-XzaYXZKRH1TIFg:APA91bHGXFvErMY3mPRVLY5Wg0CJaQrEVW8_tdQnCzIMzEffOZTw4ZH3Vawho8e9xLgx8j-Qc5qjLcXk7C6IWKgCtgYOnU_BLDX4iIFKlW-0BudIHNBXaZqikJXfzZHuQ-KL3_mIgqz8'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()