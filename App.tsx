/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import Axios from 'axios';
 import React, {useEffect, useState} from 'react';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { FlatList } from 'react-native';
 
 import {
   ActivityIndicator,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
 } from 'react-native';
 
 import {Colors} from 'react-native/Libraries/NewAppScreen';
 
 const getStorateData = async (key: string) => {
   try {
     const value = await AsyncStorage.getItem('@storage_Key_' + key);
     if (value !== null) {
       return JSON.parse(value);
     }
   } catch (e) {
     // error reading value
   }
 };
 
 const storeData = async (key: string, value: any) => {
   try {
     const jsonValue = JSON.stringify(value);
     await AsyncStorage.setItem('@storage_Key_' + key, jsonValue);
   } catch (e) {
     // saving error
   }
 };
 
 const App = () => {
   const isDarkMode = useColorScheme() === 'dark';
   const [master, setMaster] = useState<any>({});
   const [data, setData] = useState<Array<{title: string; created_at:string,author:string}>>(
     [],
   );
   const [loading, setLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(0);
 
   const isCloseToBottom = ({
     layoutMeasurement,
     contentOffset,
     contentSize,
   }: any) => {
     const paddingToBottom = 20;
     return (
       layoutMeasurement.height + contentOffset.y >=
       contentSize.height - paddingToBottom
     );
   };
 
   const getData = async () => {
     if (loading) {
       return;
     }
 
     try {
       setLoading(true);
       console.log({currentPage});
       let fromStorage = await getStorateData(String(currentPage));
       if (!fromStorage) {
         const {data: result} = await Axios.get(
           'https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' +
             currentPage,
         );
         await storeData(fromStorage, result.hits);
         fromStorage = result.hits;
         setMaster({...master, [currentPage]: result.hits});
       }
 
       setLoading(false);
     } catch (e) {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     getData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentPage]);
 
   useEffect(() => {
     let tmp = [];
     const keys = Object.keys(master);
     for (let i = 0; i < keys.length; i++) {
       tmp.push(master[i]);
     }
 
     setData(tmp.flat());
   }, [master]);
 
   useEffect(() => {
     const interval = setInterval(() => {
       setCurrentPage(o => o + 1);
       console.log('Calling API each 10s');
     }, 10000);
     return () => {
       clearInterval(interval);
     };
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
 
   return (
     <SafeAreaView style={styles.container}>
       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
       <View style={styles.header}>
         <Text style={styles.headerText}>Task 4</Text>
       </View>
       <ScrollView
         scrollEventThrottle={16}
         contentContainerStyle={styles.scroll}
         onScroll={({nativeEvent}) => {
           if (isCloseToBottom(nativeEvent)) {
             if (!loading) {
               setCurrentPage(currentPage + 1);
             }
           }
         }}>
         {data.map((datum,index ) => (
         <View key={index}>
           <Text style={styles.list}>title : {datum.title}</Text>
           <Text>created_at : {datum.created_at}</Text>
           <Text>Author : {datum.author}</Text>
           </View>
           
         ))}
         {loading && (
           <View key={'footer'} style={styles.activityWrapper}>
             <ActivityIndicator />
           </View>
         )}
       </ScrollView>
       <View style={styles.footer} />
     </SafeAreaView>
   );
 };
 
 const styles = StyleSheet.create({
   scroll: {},
   container: {
     flex: 1,
     backgroundColor: Colors.lighter,
   },
   activityWrapper: {
     padding: 24,
   },
   header: {
     backgroundColor: Colors.lighter,
     height: 58,
     shadowColor: 'rgba(0,0,0,.4)',
     shadowOffset: {width: 1, height: 1},
     shadowOpacity: 0.2,
     shadowRadius: 2,
     elevation: 2,
 
     alignItems: 'center',
     justifyContent: 'center',
   },
   headerText: {
     fontSize: 18,
   },
   footer: {
     height: 12,
     fontWeight: '600',
   },
   list:{
    borderBottomWidth:1,
    height:40
   }
 });
 
 export default App;
 