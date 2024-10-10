import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// Sample data
const initialCategories = [
    { id: '1', name: 'Thiết kế 3D' },
    { id: '2', name: 'Thiết kế đồ họa' },
    { id: '3', name: 'Phát triển Web' },
    { id: '4', name: 'SEO & Tiếp thị' },
    { id: '5', name: 'Tài chính & Kế toán' },
    { id: '6', name: 'Phát triển bản thân' },
    { id: '7', name: 'Năng suất văn phòng' },
    { id: '8', name: 'Quản lý nhân sự' },
];

const SearchScreen = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState(initialCategories);
    const [searchText, setSearchText] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(initialCategories);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleDelete = (id) => {
        setCategories(prevCategories => {
            const newCategories = prevCategories.filter(item => item.id !== id);
            setFilteredCategories(newCategories); // Also update filteredCategories
            return newCategories;
        });
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            // Check if the search text already exists in the categories
            const categoryExists = categories.some(item => item.name.toLowerCase() === searchText.toLowerCase());

            if (!categoryExists) {
                // Add new category with unique id
                const newCategory = { id: (categories.length + 1).toString(), name: searchText };
                setCategories([...categories, newCategory]);
                setFilteredCategories([...categories, newCategory]);
            } else {
                // Filter categories based on the search input
                const filtered = categories.filter(item =>
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                );
                setFilteredCategories(filtered);
            }

            setSearchText(''); // Clear the search input after searching
        }
    };

    const handleSearchTextChange = (text) => {
        setSearchText(text);
        // Filter categories as user types
        const filtered = categories.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteIconContainer}>
                <Image source={require('../design/image/ic_cancel.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>Tìm kiếm</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Tìm kiếm"
                    placeholderTextColor="#545454"
                    value={searchText}
                    onChangeText={handleSearchTextChange}
                />
                <TouchableOpacity onPress={handleSearch}>
                    <Image source={require('../design/image/ic_search.png')} style={styles.searchIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.viewAllHistory}>
                <Text style={styles.title}>Tìm kiếm gần đây</Text>
                <View style={styles.viewAll}>
                    <Text style={styles.txtView}>Xem tất cả </Text>
                    <Image source={require('../design/image/ic_right.png')} />
                </View>
            </View>
            <FlatList
                data={filteredCategories}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    txtView: {
        fontFamily: "Mulish-ExtraBold",
        fontSize: 16,
        color: '#0961F5'
    },
    title: {
        fontFamily: "Mulish-ExtraBold",
        fontSize: 16,
        color: '#202244'
    },
    viewAllHistory: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginVertical: 20,
    },
    viewAll: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 55,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginTop: 20,
    },
    searchIcon: {
        width: 30,
        height: 30 ,
        marginLeft: 10,
    },
    textInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#202244',
        fontFamily: 'Mulish-Bold',
        padding: 0,
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#F5F9FF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    txtHeader: {
        color: "#0D0D0D",
        fontFamily: "Mulish-ExtraBold",
        fontSize: 20,
        paddingLeft: 20,
    },
    imgBack: {
        width: 30,
        height: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
       
    },
    itemName: {
        fontFamily: 'Mulish-Bold',
        fontSize: 15,
        color: '#A0A4AB',
    },
    deleteIconContainer: {
        padding: 10,
    },
    deleteIcon: {
        width: 20,
        height: 20,
    },
});
