import {View} from 'react-native';
import styled from '@emotion/native';

const StyledText = styled.Text`
  font-size: 40px;
  color: firebrick;
`;

type Props = {type: 'script'};

export function TypeItem(props: Props) {
  return (
    <View>
      <StyledText>{props.type}</StyledText>
    </View>
  );
}
