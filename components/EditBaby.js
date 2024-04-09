import React, { Component, useState } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'

export default function EditBaby({ navigation }) {



  return (

    <Text>Edit Baby screen</Text>


  );




}