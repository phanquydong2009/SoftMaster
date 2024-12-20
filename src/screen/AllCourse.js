import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import BASE_URL from '../component/apiConfig';
import styles from '../styles/PopularCoursesStyles';
const PopularCourses = () => {
    const navigation = useNavigation();
    const route = useRoute(); 
    const { userID } = route.params; 
    const [activeCourse, setActiveCourse] = useState('Tất cả');
    const [activeBookmarks, setActiveBookmarks] = useState({}); 
    const [courses, setCourses] = useState([]); 
    const [courseDetails, setCourseDetails] = useState([]); 

    // Lấy danh sách môn học từ API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${BASE_URL}/subject/getAll`);
                const data = await response.json();
                // Thêm môn "Tất cả" vào đầu danh sách
                setCourses([{ _id: null, name: 'Tất cả' }, ...data]);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách môn học:', error);
            }
        };

        fetchCourses();
    }, []);

    // Lấy chi tiết khóa học dựa trên khóa học đang hoạt động
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                let response;
                if (activeCourse === 'Tất cả') {
                    response = await fetch(`${BASE_URL}/course/getAll`);
                } else {
                    // Lấy ID môn học dựa trên khóa học đang hoạt động
                    const subject = courses.find(course => course.name === activeCourse);
                    if (subject) {
                        response = await fetch(`${BASE_URL}/course/getCourseBySubjectID/${subject._id}`);
                    }
                }

                if (response) {
                    const data = await response.json();
                    setCourseDetails(data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết khóa học:', error);
            }
        };

        fetchCourseDetails();
    }, [activeCourse, courses]); // Thêm courses vào danh sách phụ thuộc

    // Hàm quay lại màn hình trước
    const handleBack = () => {
        navigation.goBack();
    };

    // Hàm chuyển đổi trạng thái bookmark cho khóa học
    const handleBookmarkToggle = (id) => {
        setActiveBookmarks(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    // Hàm hiển thị từng item khóa học
    const renderCourseItem = ({ item }) => {
        const isActive = item.name === activeCourse; 
        return (
            <TouchableOpacity
                style={[
                    styles.courseItem,
                    { backgroundColor: isActive ? '#167F71' : '#E8F1FF' }
                ]}
                onPress={() => setActiveCourse(item.name)}
            >
                <Text
                    style={[
                        styles.courseText,
                        { color: isActive ? '#FFFFFF' : '#202244' }
                    ]}
                >
                    {item.name}
                </Text>
            </TouchableOpacity >
        );
    };

    // Hàm hiển thị từng item chi tiết khóa học
    const renderDetailItem = ({ item }) => {
        const isBookmarked = activeBookmarks[item._id]; 

        const handleDetail = () => {
            console.log(`User ID: ${userID}, Course ID: ${item._id}`);
            navigation.navigate('Detail', { courseId: item._id, userID: userID });
        };
        

        return (
            <TouchableOpacity onPress={handleDetail} style={styles.detailItem}>
                <Image source={{ uri: item.img }} style={styles.detailImage} />
                <View style={styles.detailContent}>
                    <View style={styles.bookmark}>
                        <Text style={styles.detailNameCourse} numberOfLines={1} ellipsizeMode='tail'>
                            {item.name}
                        </Text>
                        <TouchableOpacity onPress={() => handleBookmarkToggle(item._id)}>
                            <Image
                                source={isBookmarked
                                    ? require('../design/image/ic_bookmark_active.png')
                                    : require('../design/image/ic_bookmark.png')}
                                style={styles.bookmarkIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.detailDescription} numberOfLines={2} ellipsizeMode='tail'>
                        {item.describe}
                    </Text>

                    <Text style={styles.detailPrice}>
                        Giá: {item.price} VND
                    </Text>

                    <Text style={styles.detailCreatedAt}>
                        Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>Tất cả khóa học</Text>
            </View>

            <View style={styles.flatListWrapper}>
                <FlatList
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item._id ? item._id.toString() : item.name} 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>

            <View style={styles.detailsWrapper}>
                <FlatList
                    data={courseDetails}
                    renderItem={renderDetailItem}
                    keyExtractor={(item) => item._id.toString()}
                    contentContainerStyle={styles.detailsContainer}
                />
            </View>
        </View>
    );
};

export default PopularCourses;
