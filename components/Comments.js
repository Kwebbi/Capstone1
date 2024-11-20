import React, { useEffect, useMemo, useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import { ref, push, set, query, orderByChild, onValue, remove } from "firebase/database";
import { auth, database } from "../config/firebase";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../components/ThemeContext"; // Import useTheme

const Comments = ({ route }) => {
  const { fullName, babyID } = route.params;
  const { isDarkMode } = useTheme();  // Use isDarkMode from context
  
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const commentRef = ref(database, "comments/");
  const navigation = useNavigation();

  const allCommentsQuery = useMemo(
    () => query(commentRef, orderByChild('dateTime')),
    [commentRef]
  );

  // Retrieve Comments from DB
  useEffect(() => {
    const unsubscribe = onValue(allCommentsQuery, (snapshot) => {
      if (snapshot.exists()) {
        let tmp = [];
        snapshot.forEach((child) => {
          tmp.push(child.val());
        });

        // Filter Comments based on the "babyId"
        const filteredComments = Object.values(tmp).filter(
          (comment) => comment.babyID && comment.babyID === babyID
        );
        
        const reversedComments = filteredComments.reverse();
        setComments(reversedComments);
      } else {
        setComments([]); // Reset comments with an empty array
      }
    });

    return () => unsubscribe();
  }, []);

  // Save comment record
  const handleSaveComment = () => {
    const newComment = {
      text: comment,
      user: auth.currentUser.email.split('@')[0],
      commentDate: new Date().toLocaleDateString(),
      dateTime: new Date().getTime(),
      babyID: babyID,
    };

    setComments([...comments, newComment]);
    setComment("");
    createComment();
  };

  // Save comment to the database
  function createComment() {
    const newCommentRef = push(commentRef);
    const commentKey = newCommentRef.key;

    const newComment = {
      commentId: commentKey,
      text: comment,
      user: auth.currentUser.email.split('@')[0],
      commentDate: new Date().toLocaleDateString(),
      dateTime: new Date().getTime(),
      babyID: babyID,
    };

    set(newCommentRef, newComment)
      .then(() => console.log("New Comment was successfully added"))
      .catch((error) => console.log(error));
  }

  // Dynamic styles based on dark or light mode
  const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const titleTextStyle = isDarkMode ? styles.darkTitleText : styles.lightTitleText;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const backgroundColor = isDarkMode ? 'black' : '#cfe2f3';
  const iconColor = isDarkMode ? '#f1f1f1' : '#28436d';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={{ position: 'absolute', left: 17, top: 90, zIndex: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color={iconColor} />
      </TouchableOpacity>

      <Text style={[titleTextStyle, { textAlign: 'center', marginVertical: 60, fontSize: 24, fontWeight: 'bold' }]}>{fullName}'s Comments</Text>

      {/* Comment Section */}
      <View style={[styles.commentSection, { backgroundColor }]}>
        <TextInput
          style={[styles.commentInput, { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
          value={comment}
          onChangeText={(text) => setComment(text)}
          placeholder="Enter your comment here..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
        />
        <Button
          mode="contained"
          title="Post"
          onPress={handleSaveComment}
        />
        
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.comment, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
              <Text style={textStyle}>User: {item.user}</Text>
              <Text style={textStyle}>Date: {item.commentDate}</Text>
              <Text style={textStyle}>{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={textStyle}>No comments yet.</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 25,
  },
  backButton: {
    position: 'absolute',
    top: 57,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  comment: {
    margin: 3,
    fontWeight: "bold",
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: 320,
  },
  commentInput: {
    width: 320,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 80,
  },
  commentSection: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    height: 700,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  lightContainer: {
    backgroundColor: '#cfe2f3', // Light mode background color
  },
  darkContainer: {
    backgroundColor: 'black', // Dark mode background color
  },
  lightTitleText: {
    color: '#28436d', // Light mode title color
    fontSize: 24,
    fontWeight: 'bold',
  },
  darkTitleText: {
    color: '#ffffff', // Dark mode title color
    fontSize: 24,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#28436d', // Light mode text color
    fontSize: 18,
  },
  darkText: {
    color: 'white', // Dark mode text color
    fontSize: 18,
  },
});

export default Comments;
