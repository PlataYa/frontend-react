import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getAllWallets } from '../api/api';
import { WalletResponseDTO } from '../dto/wallet.dto';

interface WalletsListProps {
  onWalletSelect: (wallet: WalletResponseDTO) => void;
  selectedWallet: WalletResponseDTO | null;
  currentUserEmail: string;
}

function getWalletItemList(handleSelectWallet: (wallet: WalletResponseDTO) => void, item: WalletResponseDTO) {
  return <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectWallet(item)}>
    <Text>{item.userMail} (CVU: {item.cvu})</Text>
  </TouchableOpacity>;
}

const WalletsList: React.FC<WalletsListProps> = ({ onWalletSelect, selectedWallet, currentUserEmail }) => {
  const [wallets, setWallets] = useState<WalletResponseDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterWallets = () => {
      setIsLoading(true);
      setError(null);

      getAllWallets()
        .then(fetchedWalletsData => {
          const allAvailableWallets = fetchedWalletsData.wallets || [];
          
          const filteredWallets = allAvailableWallets.filter(
            wallet => wallet.userMail !== currentUserEmail
          );
          setWallets(filteredWallets);
        })
        .catch(err => {
          console.error("Failed to fetch or filter wallets:", err);
          setError("Failed to load wallets. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (currentUserEmail) {
        fetchAndFilterWallets();
    }
  }, [currentUserEmail]);

  const handleSelectWallet = (wallet: WalletResponseDTO) => {
    onWalletSelect(wallet);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.messageText}>Loading wallets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownButtonText}>
          {selectedWallet ? `${selectedWallet.userMail} (CVU: ${selectedWallet.cvu})` : "Select a destination wallet"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownListContainer}>
          <FlatList
            data={wallets}
            keyExtractor={(item) => item.cvu.toString()}
            renderItem={({ item }) => getWalletItemList(handleSelectWallet, item)}
            nestedScrollEnabled
            ListEmptyComponent={<Text style={styles.emptyListText}>No wallets to show.</Text>}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginBottom: 20,
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  dropdownButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  dropdownListContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyListText: {
    padding: 10,
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  }
});

export default WalletsList;
