import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Permissions, Notifications } from 'expo';


export default class App extends React.Component {

  constructor(props){
    super(props)
    this.getToken = this.getToken.bind(this)

    this.state = {
      token: '',
      error: '',
      notification: '',
      expo: ''
    }

    this.sendNotification = this.sendNotification.bind(this);
  }

  componentWillMount(){
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  async _handleNotification(notification){
    // await this.setState({
    //   notification: notification
    // });
  }

  async getToken() {
    try{
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    this.setState({ token });
    } catch(error){
      this.setState({ error })
    }
  }

  async sendNotification(){
    fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify(
        [
          {
            "to": this.state.token,
            "sound": "default",
            "data": {},
            "title": "Hey it works!",
            "body": "notification!"
          }
        ]
      ),
      headers: new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Accept-Encoding', 'gzip, deflate']
      ]),
      method: 'POST',
    }).then(r => r.json())
    .then(expo => this.setState({ expo }))
    .catch(expo => this.setState({ expo }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.margin}>Press to generate token!</Text>
        <Button style={styles.margin} title="GET TOKEN" onPress={this.getToken} />
        <Text style={styles.margin}>Current push-token: {this.state.token}</Text>
        <Button style={styles.margin} title="Send Notification" onPress={this.sendNotification} />
        <Text style={styles.margin}>Received notification: {JSON.stringify(this.state.notification)}</Text>
        <Text style={styles.margin}>Expo response: {JSON.stringify(this.state.expo)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {
    margin: 50
  }
})
