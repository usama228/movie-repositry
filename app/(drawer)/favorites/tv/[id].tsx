import DetailsPage from '../../../../components/DetailsPage';
import { MediaType } from '../../../../interfaces/apiresults';
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string}>();
    

    
    return(
        <DetailsPage id={id} mediaType={MediaType.Tv} />
    );
};
export default Page;