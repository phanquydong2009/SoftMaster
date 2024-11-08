import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/SearchScreenStyles';
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

            setSearchText(''); 
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
