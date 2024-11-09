import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';
import BASE_URL from './apiConfig';

const FollowTeacherCourse = ({ userID }) => {
    const [followingData, setFollowingData] = useState([]);

    useEffect(() => {
        const fetchFollowedTeachers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/followTeacher/getFollowed-teachers/${userID}`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const coursePromises = data.map(async teacher => {
                        const courseResponse = await fetch(`${BASE_URL}/course/getCourseByTeacherID/${teacher._id}`);
                        const courseData = await courseResponse.json();

                        if (courseData && courseData.length > 0) {
                            const course = courseData[0];
                            return {
                                id: teacher._id,
                                image: course.img,
                                name: course.name,
                                price: course.price,
                                teacher_name: teacher.name,
                                description: course.description,
                                describe: course.describe,
                                createdAt: course.createdAt, // Giả sử khóa học có trường createdAt
                            };
                        }
                    });

                    const courses = await Promise.all(coursePromises);

                    // Lọc ra các khóa học hợp lệ và sắp xếp theo createdAt từ mới đến cũ
                    const validCourses = courses.filter(course => course !== undefined);

                    // Sắp xếp theo createdAt (mới nhất ở đầu)
                    validCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    setFollowingData(validCourses);
                }
            } catch (error) {
                console.error('Error fetching followed teachers:', error);
            }
        };

        fetchFollowedTeachers();
    }, [userID]);

    const renderItemFollow = ({ item }) => (
        <View style={styles.followItemContainer}>
            <View style={styles.row1}>
                <Image source={{ uri: item.image }} style={styles.followItemImage} />
                <View style={styles.followItemTextContainer}>
                    <Text style={styles.followItemName}>{item.name}</Text>
                    <Text style={styles.followItemPrice}>{item.price} VND</Text>
                    <Text style={styles.followItemTeacher} numberOfLines={1} ellipsizeMode="tail">{item.teacher_name}</Text>
                </View>
              
            </View>

            {/* Hiển thị trường describe nếu có */}
            <Text style={styles.followItemDescription} numberOfLines={1} ellipsizeMode="tail">
                {item.describe}
            </Text>
        </View>
    );

    return (
        <View style={styles.containerItemF}>
            <Text style={styles.title}>Đang theo dõi</Text>
            <FlatList
                data={followingData}
                renderItem={renderItemFollow}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: "Mulish-ExtraBold",
        fontSize: 18,
        color: "black",
    },
    containerItemF: {
        flex: 1,
    },
    flatListContent: {
        paddingHorizontal: 10,
    },
    followItemContainer: {
        width: 250,
        marginRight: 15,
        marginVertical: 20,
        backgroundColor: '#FFFFFF',
        borderRadius : 20,
        padding : 10
    },
    row1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    followItemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    followItemTextContainer: {
        flex: 1,
    },
    followItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "black",
    },
    followItemPrice: {
        fontFamily: "Mulish-ExtraBold",
        color: "#0961F5",
    },
    followItemTeacher: {
        fontFamily: "Mulish-ExtraBold",
        color: "#0961F5",
    },
    followItemDescription: {
        fontSize: 12,
        marginTop: 5,
        fontFamily: "Mulish-ExtraBold",
        color: "black",
        textAlign: 'justify',
    },
});

export default FollowTeacherCourse;
