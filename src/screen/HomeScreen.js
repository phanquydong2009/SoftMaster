import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, FlatList, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const images = [
    require('../design/image/slide1.jpg'),
    require('../design/image/slide3.png'),
    require('../design/image/slide1.jpg'),
    require('../design/image/slide3.png'),
    require('../design/image/slide1.jpg'),
];



const HomeScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [selectedCourse, setSelectedCourse] = useState('Tất cả');
    const [isBookmarked, setIsBookmarked] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [mentors, setMentors] = useState([]);
    const flatListRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { name } = route.params || {};


    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    // gọi api Subject
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/subject/getAll');
                setSubjects(response.data.map(course => course.name));
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);
  // api card course
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/course/getAll');
            const json = await response.json();
            setCardData(json);
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
}, []);
    // Gọi API để lấy dữ liệu giảng viên
    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axios.get('http://localhost:3001/teacher/getAll');
                console.log(response.data); 
                setMentors(response.data.map(mentor => ({
                    id: mentor.id ? mentor.id.toString() : '', 
                    avatar: { uri: mentor.avatar }, 
                    name: mentor.name || 'Tên chưa xác định', 
                })));
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };

        fetchMentors();
    }, []);
  
    // chuyển trang
    const handleViewAllCategory = () => {
        navigation.navigate('AllCategory');
    };
    const handleViewAllMentor = () => {
        navigation.navigate('AllMentor');
    };
    const handleViewPopularCourses = () => {
        navigation.navigate('PopularCourses');
    };
    const handleSearch = () => {
        navigation.navigate('Search');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
        }
    }, [currentIndex]);

    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const handleBookmarkPress = (id) => {
        setActiveBookmarks(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <Image source={item} style={styles.slideImage} />
        </View>
    );

    const dotSize = (index) => (index === currentIndex ? { width: 18, height: 8 } : { width: 8, height: 8 });

    const dotColor = (index) => (index === currentIndex ? '#FAC840' : '#1A6EFC');


    const renderCourseItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.courseItem,
                {
                    backgroundColor: item === selectedCourse ? '#2795FF' : '#E8F1FF',
                    borderRadius: 20,
                }
            ]}
            onPress={() => setSelectedCourse(item)}
        >
            <Text style={[styles.courseText, { color: item === selectedCourse ? '#FFFFFF' : '#202244' }]}>{item}</Text>
        </TouchableOpacity>
    );

    
    const renderCardItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Image source={{ uri: item.img }} style={styles.cardImage} />
                <View style={styles.bookmark}>
                    <Text 
                        style={styles.cardInstructor}
                        numberOfLines={1}  
                        ellipsizeMode="tail" 
                    >
                        {item.name}
                    </Text>
                    <TouchableOpacity onPress={toggleBookmark}>
                        <Image
                            source={isBookmarked ? require('../design/image/ic_bookmark_active.png') : require('../design/image/ic_bookmark.png')}
                            style={styles.ic_bookmark}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerText}>
                    {/* <Text style={styles.cardInfo}>Cập nhật ngày: {new Date(item.createdAt).toLocaleDateString()}</Text> */}
                    <Text style={styles.cardInfo}>Giá khóa học : {item.price} VND</Text>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.describe}>
                        {item.describe}
                    </Text>
                </View>
            </View>
        );
    };
    
    const renderMentorItem = ({ item }) => (
        <View style={styles.mentorCard}>
            <Image source={item.avatar} style={styles.mentorAvatar} />
            <Text style={styles.mentorName}>{item.name}</Text>
        </View>
    );
    // Thêm getItemLayout vào FlatList để biết kích thước của các mục
    const getItemLayout = (data, index) => ({
        length: width,
        offset: width * index, 
        index
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.header1}>
                    <View style={styles.welcome_container}>
                        <Text style={styles.txtHi}>Xin chào, </Text>
                        <Text style={styles.txtName}>{name}!</Text>
                    </View>
                    <Text style={styles.txtFind}>Bạn muốn học gì hôm nay? Tìm kiếm bên dưới.</Text>
                </View>
                <View style={styles.header2}>
                    <TouchableOpacity style={styles.btn_noti}>
                        <Image source={require('../design/image/ic_notification.png')} style={styles.img_btn_noti} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.searchContainer}>
                <Image source={require('../design/image/ic_search.png')} style={styles.searchIcon} />
                <TextInput
                    style={styles.textInput}
                    placeholder="Tìm kiếm"
                    placeholderTextColor="#545454"
                />
                <TouchableOpacity onPress={handleSearch}>
                    <Image source={require('../design/image/ic_time.png')} style={styles.searchIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.slide_container}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `image-${index}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    getItemLayout={getItemLayout} // Thêm getItemLayout vào FlatList
                />
                <View style={styles.dotContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.dot, dotSize(index), { backgroundColor: dotColor(index) }]}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.category}>
                <Text style={styles.title}>Danh mục</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllCategory}>
                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.popularCourses}>
                <Text style={styles.title}>Khóa học</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewPopularCourses}>
                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={subjects}
                renderItem={renderCourseItem}
                keyExtractor={(item) => `course-${item}`}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.cardsContainer}>
                <FlatList
                    data={cardData}
                    renderItem={renderCardItem}
                    keyExtractor={(item) => item.id ? `card-${item.id}` : `card-${Math.random().toString(36).substr(2, 9)}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.mentors_container}>
                <Text style={styles.title}>Giảng viên</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllMentor}>
                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={mentors}
                renderItem={renderMentorItem}
                keyExtractor={(item, index) => `mentor-${item.id}-${index}`} 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.viewMentor}
            />
        </ScrollView>
    );
};
export default HomeScreen;
const styles = StyleSheet.create({
    viewMentor: {
        marginBottom: 20,
        marginVertical: 10,
    },
    mentors_container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingRight: 10,
    },
    mentorAvatar: {
        width: 70,
        height: 70,
        borderRadius: 20,
    },
    mentorName: {
        fontFamily: 'Mulish-Bold',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        color: '#202244',
    },
    mentorCard: {
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    ic_bookmark: {
        width: 30,
        height: 30,
    },
    bookmark: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },
    cardsContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    card: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
        width: 290,
        height: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,

    },
    cardImage: {
        width: 290,
        height: '60%',
        borderRadius: 10,
    },
 
    cardInstructor: {
        fontFamily: 'Mulish-ExtraBold',
        fontSize: 18,
        color: '#202244',
        marginBottom: 5,
       
    },
   describe :{
        fontFamily: 'Mulish-Bold',
        fontSize: 12,
        color: '#202244',
        marginBottom: 3,
    },
    cardInfo: {
        fontFamily: 'Mulish-ExtraBold',
        fontSize: 12,
        color: '#FF6B00',
        marginBottom: 3,
    },
    containerText: {
        marginHorizontal: 20
    },
    popularCourses: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingRight: 10,
        marginBottom: 10
    },
    title: {
        fontFamily: "Mulish-ExtraBold",
        fontSize: 18,
        color: "black",
    },
    viewAllText: {
        fontFamily: "Mulish-ExtraBold",
        fontSize: 15,
        color: "#0961F5",
        paddingRight: 20,
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: 'center',
    },

    category: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingRight: 10,
        marginVertical: 10,

    },
    courseItem: {
        marginHorizontal: 5,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseText: {
        fontFamily: 'Mulish-Bold',
        fontSize: 16,
    },
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingVertical: 15,
        backgroundColor: "#F5F9FF",
    },
    header: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    header1: {
        flexDirection: "column",
        flex: 3,
    },
    header2: {
        flexDirection: "column",
        flex: 1,
        marginHorizontal: 20,
        alignItems: "flex-end",
    },
    btn_noti: {
        width: 40,
        height: 40,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#167F71',
        justifyContent: "center",
        alignItems: "center",
    },
    img_btn_noti: {
        width: 30,
        height: 30,
    },
    welcome_container: {
        flexDirection: "row",
    },
    txtHi: {
        fontFamily: 'Mulish-Bold',
        color: "#202244",
        fontSize:18,
    },
    txtName: {
        fontFamily: 'Mulish-Bold',
        color: "#202244",
        fontSize: 19,
    },
    txtFind: {
        fontFamily: 'Mulish-Bold',
        color: "rgba(84, 84, 84, 0.8)",
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '94%',
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
        width: 25,
        height: 25,
        marginRight: 3,
    },
    textInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#202244',
        fontFamily: 'Mulish-Bold',
        padding: 0,
    },
    slide_container: {
        width: '94%',
        height: 200,
        marginTop: 20,
        position: 'relative',
    },
    slide: {
        width: width,
        borderRadius: 20,
        overflow: 'hidden',
    },
    slideImage: {
        width: '89%',
        height: '100%',
        borderRadius: 20,
    },
    dotContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    dot: {
        borderRadius: 4,
        marginHorizontal: 4,
    },
});
