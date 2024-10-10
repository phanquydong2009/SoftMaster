import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PopularCourses = () => {
    const navigation = useNavigation();
    const [activeCourse, setActiveCourse] = useState('Tất cả');
    const [activeBookmarks, setActiveBookmarks] = useState({});
    const [courses, setCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);

    // Fetch the subject list from API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://192.168.1.4:3001/subject/getAll');
                const data = await response.json();
                // Map to include both name and id
                setCourses([{ _id: null, name: 'Tất cả' }, ...data]); // Add the default "Tất cả" at the beginning
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    // Fetch course details based on active course
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                let response;
                if (activeCourse === 'Tất cả') {
                    response = await fetch('http://192.168.1.4:3001/course/getAll');
                } else {
                    // Get the subject ID based on the active course
                    const subject = courses.find(course => course.name === activeCourse);
                    if (subject) {
                        response = await fetch(`http://192.168.1.4:3001/course/getCourseBySubjectID/${subject._id}`);
                    }
                }

                if (response) {
                    const data = await response.json();
                    setCourseDetails(data);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [activeCourse, courses]); // Add courses as a dependency

    const handleBack = () => {
        navigation.goBack();
    };
   
    const handleBookmarkToggle = (id) => {
        setActiveBookmarks(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

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

    const renderDetailItem = ({ item }) => {
        const isBookmarked = activeBookmarks[item._id];
        
        const handleDetail = () => {
            navigation.navigate('Detail', { courseId: item._id }); 
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
                <Text style={styles.txtHeader}>Khóa học phổ biến</Text>
            </View>

            <View style={styles.flatListWrapper}>
                <FlatList
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item._id ? item._id.toString() : item.name} // Use ID if available
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

const styles = StyleSheet.create({
    bookmark: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    
    },
    flatListWrapper: {
        justifyContent: 'center',
    },

    courseItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    courseText: {
        fontFamily: "Mulish-Bold",
        fontSize: 15,
    },
    detailsWrapper: {
        marginTop:10,
    },
    detailsContainer: {
        paddingVertical: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailImage: {
        width: 140,
        height: 140,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 15,
    },
    detailContent: {
        flex: 1,
   
    },
    detailNameCourse: {
        fontFamily: 'Mulish-ExtraBold',
        fontSize: 15,
        color: '#0961F5',
        marginBottom: 5,
        width :150,
    },
    bookmarkIcon : {
        width : 30, height :30,
    },
    detailDescription: {
        fontFamily: 'Mulish-Bold',
        fontSize: 12,
        color: '#202244',
        marginBottom: 5,
    },
    detailPrice: {
        fontFamily: 'Mulish-Bold',
        fontSize: 14,
        color: '#FF6B00',
        marginBottom: 5,
    },
    detailCreatedAt: {
        fontFamily: 'Mulish-Bold',
        fontSize: 12,
        color: '#202244',
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#F5F9FF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
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
});
