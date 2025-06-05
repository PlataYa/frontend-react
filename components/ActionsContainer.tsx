import {Button, View} from "react-native";
import React from "react";
import PrimaryButton from "./PrimaryButton";

type Props = {
  action1: () => any;
  action2: () => any;
};

const ActionsContainer: React.FC<Props> = ({action1, action2}) => {
  return (
    <View>
      <PrimaryButton title={"Transferir dinero a una cuenta de PlataYa"} onPress={action1} />
      <PrimaryButton title={"Transferir dinero a una cuenta externa"} onPress={action2} />
    </View>
  )
}

export default ActionsContainer;
