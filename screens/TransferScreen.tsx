import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/types";
import {useNavigation} from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, 'Transfer'>;

const TransferScreen: React.FC<Props> = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation<any>();

  const goBack = () => {navigation.goBack();};

  return (
    <View style={styles.container}>
      <PrimaryButton title={"Volver"} onPress={goBack} />
      <Text style={styles.text}>Hola {user.name}, transferí tu plata</Text>
    </View>
  )
}

export default TransferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
