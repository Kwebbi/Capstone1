import React, { useEffect, useMemo, useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, } from "react-native"
import { ref, push, set, query, orderByChild, onValue, remove } from "firebase/database"
import { auth, database } from "../config/firebase"
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Comments = ({ route }) => {
  const { fullName, babyID } = route.params;

  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const commentRef = ref(database, "comments/")
  const navigation = useNavigation();

  const allCommentsQuery = useMemo(
    () => query(commentRef, orderByChild('dateTime')),
    [commentRef]
  )
  
  // Retrieving Comments from DB
  useEffect(() => {
    const unsubscribe = onValue(allCommentsQuery, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Comments found in DB!!!")
        let tmp = []
        snapshot.forEach((child) => {
          //console.log(child.key, child.val());
          tmp.push(child.val())
        })

        // Filter Comments based on the "babyId"
        const filteredComments = Object.values(tmp).filter(
          (comment) => comment.babyID && comment.babyID == babyID
        )
      
        // Reverse the order of filtered comments
        const reversedComments = filteredComments.reverse();
  
        // Set reversed comments to state
        setComments(reversedComments)
        
      } else {
        console.log("No Comments found")
        setComments([]) // Reset comments with empty array
      }
    })

    return () => unsubscribe()
  }, [])

  //Save comment record
  const handleSaveComment = () => {
    const newComment = {
      text: comment,
      user: auth.currentUser.email.split('@')[0],
      commentDate: new Date().toLocaleDateString(),
      dateTime: new Date().getTime(),
      babyID: babyID,
    }

    setComments([...comments, newComment])
    setComment("")
    console.log("Comment Saved!")

    createComment()
  }

  // Saves comments to the database
  function createComment() {
    const newCommentRef = push(commentRef)
    const commentKey = newCommentRef.key

    // Create the new comment entry with a uniquely generated key
    const newComment = {
      commentId: commentKey,
      text: comment,
      user: auth.currentUser.email.split('@')[0],
      commentDate: new Date().toLocaleDateString(),
      dateTime: new Date().getTime(),
      babyID: babyID,
    }

    // Set the new baby entry in the database and to catch error in case there is an error
    set(newCommentRef, newComment)
      .then(() => {
        console.log("New Comment was successfully added")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <View style={styles.container}>
    <View style={{ height: 13 }} />
      {/* Back button to navigate to previous screen */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{fullName}'s Comments</Text>

      {/* Comment Section Modal */}
        <View style={styles.commentSection}>
          {/* Comment Input Field */}
          <TextInput
            style={styles.commentInput}
            label="Add a comment"
            value={comment}
            onChangeText={(text) => setComment(text)}
            mode="outlined"
            placeholder="Enter your comment here..."
          />
          {/* Submit Button */}
          <View style={{ marginVertical: 5 }}>
            <Button
              mode="contained"
              title="  Post  "
              onPress={handleSaveComment}
            ></Button>
          </View>
          {/* Display list of comments */}
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.user}>User: {item.user}</Text>
                <Text>Date: {item.commentDate}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={<Text>No comments yet.</Text>}
          />
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    borderColor: "#999",
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
    backgroundColor: "white",
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
});

export default Comments;