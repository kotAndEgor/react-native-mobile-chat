import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Input, Button } from 'react-native-elements';
import { _setData } from './localStorage';
import { REST_HOST } from './config';

export default class LoginForm extends React.Component {
  state = {
    login: '',
    password: '',
    error: null
  }
  handleLogin(value) {
    this.setState({ login: value });
  }
  login() {
    const login = this.state.login;
    const password = this.state.password;
    if (
      login && password &&
      login.length > 1 &&
      login.length < 20 &&
      password.length > 1 &&
      password.length < 20
    ) {
      fetch(`${REST_HOST}/api/login/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })
      .then((response) => response.json())
      .then(async (json) => {
        if(json && json.token) {
          await _setData('token', json.token);
          await _setData('login', login);
          this.props.navigation.push('Chat')
        } else {
          this.setState({ error: 'Invalid login | password' });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      console.log('Error login or password is empty' + login + password);
    }

  }
  render() {
    const color = '#6a739f';
    const error = this.state.error != null ? 
      (<Text style={{color: 'red'}}>{this.state.error}</Text>) :
      (<Text>{''}</Text>);

    return (
      <View style={{ flex: 1, flexDirection: 'row' }} >
        <View style={{ width: 60 }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          <Input
            value={this.state.login}
            onChangeText={ p => this.setState({ login: p }) }
            maxLength={20}
            underlineColorAndroid={color}
            containerStyle={styles.containerStyleInput}
            inputStyle={{ color: 'white' }}
            placeholder='YOUR LOGIN'
            leftIcon={<CustomIcon isPassword={false} />}
          />
          <Input
            value={this.state.password}
            onChangeText={ p => this.setState({ password: p }) }
            maxLength={20}
            underlineColorAndroid={color}
            containerStyle={styles.containerStyleInput}
            inputStyle={{ color: 'white' }}
            secureTextEntry={true}
            placeholder='YOUR PASSWORD'
            leftIcon={<CustomIcon isPassword={true} />}
          />
          <Button
            onPress={() => this.login()}
            buttonStyle={styles.buttonStyle}
            title="SIGN IN"
          />
          {error}
        </View>
        <View style={{ width: 60 }} />
      </View>
    )
  }
}
const CustomIcon = ({ isPassword }) => (
  <Icon
    style={{ marginRight: 10, marginLeft: -10 }}
    name={isPassword ? 'lock' : 'user'}
    size={24}
    color='#6a739f'
  />
)
const styles = StyleSheet.create({
  buttonStyle: {
    width: 150,
    padding: 15,
    backgroundColor: '#6a739f'
  },
  containerStyleInput: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6a739f',
    borderRadius: 20,
    minWidth: 300,
    maxWidth: 300
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});