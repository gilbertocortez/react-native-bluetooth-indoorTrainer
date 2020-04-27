import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, PermissionsAndroid, FlatList } from 'react-native'
import BluetoothSerial from 'react-native-bluetooth-serial'
import KeepAwake from 'react-native-keep-awake'

const IndoorTrainer = () => {

  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    .then(result => {
      if (!result) {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      }
    });

  // Initial states
  const [bluetoothDeviceInitialState, setbluetoothDeviceInitialState] = useState({
    isEnabled: false,
    loading: true
  });
  const [bluetoothDeviceState, setbluetoothDeviceState] = useState({
    discovering: false,
    connected: false,
    devices: [],
    unpairedDevices: []
  });

  // Use effect when enable button is clicked
  useEffect(() => {
    if (bluetoothDeviceInitialState.isEnabled === true) {
      console.log('new try -------------------------');
      console.log('Bluetooth has been enabled');
      console.log(bluetoothDeviceInitialState);
      console.log(bluetoothDeviceState);
      afterEnable();
    } else console.log('Bluetooth is not enabled');
  }, [bluetoothDeviceInitialState]);

  // Options completed after bluetooth is enabled
  const afterEnable = () => {
    BluetoothSerial.on('bluetoothEnabled', () => console.log('Bluetooth enabled'))
    BluetoothSerial.on('bluetoothDisabled', () => console.log('Bluetooth disabled'))
    BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
    console.log('completed afterEnable()');
  }

  // After discover devices button is clicked
  const discoverUnpaired = () => {
    //console.log('Start discovering devices');
    if (bluetoothDeviceState.discovering === true) {
      console.log('cancel on discoverUnpaired()');
      return false
    } else {
      console.log('Start discovering bluetooth devices');
      setbluetoothDeviceState({
        discovering: false,
        connected: false,
        devices: [],
        unpairedDevices: []
      });

      BluetoothSerial.discoverUnpairedDevices()
        .then((unpairedDevices) => {
          console.log('Found devices, adding to state');
          //console.log(unpairedDevices);
          setbluetoothDeviceState({
            discovering: false,
            connected: false,
            devices: [],
            unpairedDevices: unpairedDevices,
          })
        })
        .catch((err) => console.log(err.message))
    }
  }


  useEffect(() => {
    console.log("Bluetooth devices updated");
    //console.log(bluetoothDeviceState.unpairedDevices);
  }, [bluetoothDeviceState]);


  // Request bluetooth to be enabled
  const requestEnable = () => {
    BluetoothSerial.requestEnable()
      .then((res) => setbluetoothDeviceInitialState({
        isEnabled: true,
        loading: false
      })
      )
      .catch((err) => console.log(err.message));
  }

  /**
   * Connect to bluetooth device by id
   * @param  {Object} device
   */
  const connectToBluetoothDevice = (device) => {
    console.log(`Trying to connect to device ${device.name}`)
    BluetoothSerial.connect(device.id)
      .then((res) => {
        console.log(`Connected to device ${device.name}`)
        console.log(bluetoothDeviceState)
      })
      .catch((err) => console.log(err.message))
  }

  /**
   * [android]
   * Pair device
   */
  const pairDevice = (device) => {
    console.log(`Trying to pair to device ${device.name}`)
    BluetoothSerial.pairDevice(device.id)
      .then((paired) => {
        console.log(`Pairing to device ${device.name}`)
        if (paired) {
          console.log(`Paired to device ${device.name}`)
          console.log(bluetoothDeviceState)
        } else {
          console.log(`Device ${device.name} pairing failed`)
        }
      })
      .catch((err) => console.log(err.message))
  }

  /**
 * Disconnect from bluetooth device
 */
  const disconnect = (device) => {
    BluetoothSerial.unpairDevice(device.id)
    BluetoothSerial.disconnect()
      .then(() => console.log('Device disconnected'))
      .catch((err) => console.log(err.message))
  }

  const readFromBluetoothDevice = () => {
    console.log('Reading from device')
    BluetoothSerial.readFromDevice().
    then((data) => {
      console.log('Device read')
      console.log('Data: ' + data)
    })
    .catch((err) => console.log(err.message))
  }


  return (
    <View>
      <Text>Bluethoot App</Text>
      <Button
        title='Request enable'
        onPress={() => requestEnable()} />
      <Button
        title='Read from device'
        onPress={() => setTimeout(readFromBluetoothDevice, 3000)} />
      <Button
        title='Discover devices'
        onPress={() => discoverUnpaired()} />

      <FlatList
        data={bluetoothDeviceState.unpairedDevices}
        ItemSeparatorComponent={
          () => <View style={{ width: 16, backgroundColor: 'pink' }} />
        }
        renderItem={({ item }) => (
          <View>
            <Text>Device:</Text>
            <Text>{item.name}</Text>
            <Text>{item.id}</Text>
            <Text>{item.address}</Text>
            <Text>{item.class}</Text>
            <Button
              title='Connect to device'
              onPress={() => connectToBluetoothDevice(item)} />
            <Button
              title='Pair to device'
              onPress={() => pairDevice(item)} />
            <KeepAwake />
            <Button
              title='Disconnect devices'
              onPress={() => disconnect(item)} />
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default IndoorTrainer

const styles = StyleSheet.create({})
