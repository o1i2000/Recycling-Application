import { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const MapFilter = ({ navigation }: { navigation: any }) => {

    const checkBoxName = ['Organic', 'Batteries', 'Cartons', 'General', 'Electronic', 'Fabric', 'Chemical', 'Plastic', 'Food Donation'];

    const [filters, setFilters] = useState({
        acceptsOrganic: false,
        acceptsBatteries: false,
        acceptsCartons: false,
        acceptsGeneral: false,
        acceptsElectronic: false,
        acceptsFabric: false,
        acceptsChemical: false,
        acceptsPlastic: false,
        acceptsFoodDonation: false,
    });

    const listBoxes = () => {

        const checkBoxes = checkBoxName.map((name, index) => {
            const filterKey = `accepts${name.replaceAll(' ', '')}`;
            return (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                        value={filters[filterKey as keyof typeof filters]}
                        onValueChange={(newValue) => setFilters((filters) => ({ ...filters, [filterKey]: newValue }))}
                    />
                    <Text>{name}</Text>
                </View>
            );
        });

        return (
            <View>
                {checkBoxes}
            </View>
        );

    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.header}>What are you throwing away?</Text>
            <View style={{margin: '3%'}}>
                {listBoxes()}
            </View>
            <View style={{ alignSelf: 'center', width: '70%', marginTop: '5%' }}>
                <Button color='limegreen' title='Confirm' onPress={() => navigation.navigate('Map', filters)} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: '3%'
    }
})

export default MapFilter