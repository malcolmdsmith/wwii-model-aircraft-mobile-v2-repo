import { Dimensions } from 'react-native';
import { isTablet } from 'react-native-device-detection';

export function getPaginationButtonWidth()
{
    const dimensions = Dimensions.get('window');
    const factor = isTablet ? 20 : 15;
    const width = (dimensions.width/4)-factor;

    return width;
}