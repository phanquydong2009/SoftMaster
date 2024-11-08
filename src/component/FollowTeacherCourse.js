import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';

const FollowTeacherCourse = ({ userID }) => {  // Nhận userID từ props
    const [followingData, setFollowingData] = useState([]);  // State để lưu dữ liệu khóa học theo dõi

    useEffect(() => {
        // Bước 1: Lấy danh sách giáo viên đã theo dõi
        const fetchFollowedTeachers = async () => {
            try {
                const response = await fetch(`http://192.168.1.5:3001/followTeacher/getFollowed-teachers/${userID}`);
                const data = await response.json();
                
                if (data && data.length > 0) {
                    // Bước 2: Với mỗi giáo viên, lấy thông tin khóa học
                    const coursePromises = data.map(async teacher => {
                        const courseResponse = await fetch(`http://192.168.1.5:3001/course/getCourseByTeacherID/${teacher._id}`);
                        const courseData = await courseResponse.json();

                        // Nếu có khóa học, chỉ lấy khóa học đầu tiên
                        if (courseData && courseData.length > 0) {
                            const course = courseData[0];  // Lấy khóa học đầu tiên
                            return {
                                id: teacher._id,  // ID giáo viên
                                image: course.img,  // Hình ảnh khóa học
                                name: course.name,  // Tên khóa học
                                price: course.price,  // Giá khóa học
                                teacher_name: teacher.name,  // Tên giáo viên
                                description: course.description,  // Mô tả khóa học
                                describe: course.describe,  // Thêm trường describe
                            };
                        }
                    });

                    // Chờ tất cả các API khóa học hoàn thành
                    const courses = await Promise.all(coursePromises);

                    // Lọc ra các khóa học không có dữ liệu
                    const validCourses = courses.filter(course => course !== undefined);
                    setFollowingData(validCourses);  // Cập nhật state
                }
            } catch (error) {
                console.error('Error fetching followed teachers:', error);
            }
        };

        fetchFollowedTeachers();
    }, [userID]);  // Chạy lại mỗi khi userID thay đổi

    // Hàm renderItem cho mục "Đang theo dõi"
    const renderItemFollow = ({ item }) => (
        <View style={styles.followItemContainer}>
            <View style={styles.row1}>
                <Image source={{ uri: item.image }} style={styles.followItemImage} />
                <View style={styles.followItemTextContainer}>
                    <Text style={styles.followItemName}>{item.name}</Text>
                    <Text style={styles.followItemPrice}>{item.price} VND</Text>
                    <Text style={styles.followItemTeacher}>{item.teacher_name}</Text>
                </View>
                <Text style={styles.followItemDescription} numberOfLines={2} ellipsizeMode="tail">
                {item.description}
            </Text>
            </View>
           
            {/* Hiển thị trường describe nếu có */}
            <Text style={styles.followItemDescription}>
                {item.describe}
            </Text>
        </View>
    );

    return (
        <View style={styles.containerItemF}>
            <Text style={styles.title}>Đang theo dõi</Text>
            {/* Hiển thị danh sách các khóa học đang theo dõi theo chiều ngang */}
            <FlatList
                data={followingData}
                renderItem={renderItemFollow}
                keyExtractor={item => item.id}
                horizontal={true}  // Set flatlist to be horizontal
                showsHorizontalScrollIndicator={false}  // Hide horizontal scroll indicator (optional)
                contentContainerStyle={styles.flatListContent} // Optional: add style for spacing
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
        marginVertical: 20
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
        textAlign: 'justify'
    },
});

export default FollowTeacherCourse;
