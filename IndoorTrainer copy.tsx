import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import BluetoothSerial from 'react-native-bluetooth-serial'

const IndoorTrainer = () => {
  const [bluetoothDeviceInitialState, setbluetoothDeviceInitialState] = useState({
    isEnabled: false,
    loading: true
  });

  const [bluetoothDeviceState, setbluetoothDeviceState] = useState({
    discovering: false,
    devices: [],
    unpairedDevices: [],
    connected: false,
    section: 0,
  });

  Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
    values => {
      if (bluetoothDeviceInitialState.loading === true) {
        setbluetoothDeviceInitialState({
          isEnabled: false,
          loading: false
        });
      }
    }
  );

  useEffect(() => {
    if (bluetoothDeviceInitialState.isEnabled === true) {
      discoverUnpaired();
      //console.log('test');
    } else console.log('No');
  }, [bluetoothDeviceInitialState]);

  useEffect(() => {

    //console.log(bluetoothDeviceState);
  }, [bluetoothDeviceState]);

  const discoverUnpaired = () => {
    if (bluetoothDeviceState.discovering) {
      return false
    } else {
      console.log('test inside 2');
      setbluetoothDeviceState({
        discovering: true,
        devices: [],
        unpairedDevices: [],
        connected: false,
        section: 0,
      });

      BluetoothSerial.discoverUnpairedDevices()
        .then((unpairedDevices) => {
          console.log(unpairedDevices);
          setbluetoothDeviceState({
            discovering: false,
            devices: [],
            unpairedDevices: unpairedDevices,
            connected: false,
            section: 0,
          })
        })
        .catch((err) => console.log(err.message))
    }
  }

  const requestEnable = () => {
    BluetoothSerial.requestEnable()
      .then((res) => setbluetoothDeviceInitialState({
                        isEnabled: true,
                        loading: false
                      })
            )
      .catch ((err) => Toast.showShortBottom(err.message));
  }


return (
  <View>
    <Text>Testing</Text>
    <Button
      title='Request enable'
      onPress={() => requestEnable()} />
  </View>
)
}

export default IndoorTrainer

const styles = StyleSheet.create({})
