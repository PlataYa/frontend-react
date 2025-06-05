import {StyleSheet, Text, View} from "react-native";
import React, { useState } from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/types";
import {useNavigation} from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import WalletsList from "../components/WalletsList";
import { WalletResponseDTO } from "../dto/wallet.dto";

type Props = NativeStackScreenProps<RootStackParamList, 'Transfer'>;

const TransferScreen: React.FC<Props> = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation<any>();
  const [selectedWallet, setSelectedWallet] = useState<WalletResponseDTO | null>(null);

  const goBack = () => {navigation.goBack();};

  const handleWalletSelection = (wallet: WalletResponseDTO) => {
    setSelectedWallet(wallet);
    console.log("Selected wallet:", wallet);
  };

  const currentUserEmail = user?.mail;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Hola {user.name}, transferí tu plata</Text>
      {currentUserEmail ? (
        <WalletsList 
          onWalletSelect={handleWalletSelection} 
          selectedWallet={selectedWallet} 
          currentUserEmail={currentUserEmail}
        />
      ) : (
        <Text style={styles.errorText}>User information is not available to load wallets.</Text>
      )}
      {selectedWallet && (
        <Text style={styles.selectedWalletText}>
          Transferir a: {selectedWallet.userMail} (CVU: {selectedWallet.cvu})
        </Text>
      )}
      <PrimaryButton title={"Volver"} onPress={goBack} />
    </View>
  )
}

export default TransferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleText: {
    fontSize: 20,
    marginBottom: 20,
  },
  selectedWalletText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  }
});
