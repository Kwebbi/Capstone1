import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { ref, onValue, query, orderByChild } from "firebase/database"
import { database } from "../config/firebase"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

const getLastWeekDates = () => {
  const currentDate = new Date()
  const lastWeekDates = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() - i)

    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString()
    const year = date.getFullYear().toString()

    const formattedDate = `${month}/${day}/${year}`

    lastWeekDates.push({
      date,
      label: formattedDate,
      dayName: date.toLocaleString("default", { weekday: "long" }),
    })
  }

  return lastWeekDates.reverse()
}

const formatTimestampToMMDDYY = (timestamp) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear().toString().slice(-2) 
  return `${month}/${day}/${year}`
}

const WeeklyReport = ({ route }) => {
  const { fullName, babyID } = route.params
  const [dailyReports, setDailyReports] = useState([])
  const [feedings, setFeedings] = useState([])
  const [diaperChanges, setDiaperChanges] = useState([])
  const [sleepRecords, setSleepRecords] = useState([])

  const navigation = useNavigation()

  const feedingTimeRef = ref(database, "feedingTimes/")
  const diaperChangeRef = ref(database, "diaperChanges/")
  const sleepTimeRef = ref(database, "sleepTimes/")

  const fetchFeedings = () => {
    const allFeedingTimesQuery = query(feedingTimeRef, orderByChild("dateTime"))
    const unsubscribe = onValue(allFeedingTimesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const feedingsArray = Object.values(snapshot.val()).filter(
          (feeding) => feeding.babyID === babyID
        )
        setFeedings(feedingsArray)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }

  const fetchDiaperChanges = () => {
    const unsubscribe = onValue(diaperChangeRef, (snapshot) => {
      if (snapshot.exists()) {
        const diaperChangesArray = Object.values(snapshot.val()).filter(
          (change) => change.babyID === babyID
        )
        setDiaperChanges(diaperChangesArray)
      }
    })
    return () => unsubscribe()
  }

  const fetchSleepRecords = () => {
    const unsubscribe = onValue(sleepTimeRef, (snapshot) => {
      const fetchedSleepRecords = []
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().babyID === babyID) {
          fetchedSleepRecords.push(childSnapshot.val())
        }
      })
      setSleepRecords(fetchedSleepRecords)
    })
    return () => unsubscribe()
  }


  useEffect(() => {
    const unsubscribeFeedings = fetchFeedings()
    const unsubscribeDiapers = fetchDiaperChanges()
    const unsubscribeSleep = fetchSleepRecords()

    const lastWeekDates = getLastWeekDates()

    const initialDailyReports = lastWeekDates.map((day) => ({
      date: day.label,
      dayName: day.dayName,
      feeding: 0,
      sleep: 0,
      diapers: 0,
    }))

    setDailyReports(initialDailyReports)

    return () => {
      unsubscribeFeedings()
      unsubscribeDiapers()
      unsubscribeSleep()
    }
  }, [])
  console.log(sleepRecords)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{fullName}'s Report for Last Week</Text>

      <ScrollView style={styles.scrollContainer}>
        {dailyReports.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text
              style={styles.dayTitle}
            >{`${day.dayName} (${day.date})`}</Text>
            <Text style={styles.dayDetail}>
              Feeding:
              {feedings
                .filter((el) => el.feedingDate === day.date)
                .map((el) => (
                  <Text>
                    {el.foodChoice} {el.feedingAmount} ml at {el.feedingTime},
                  </Text>
                ))}
            </Text>
            <Text style={styles.dayDetail}>
              Sleep Records:
              {sleepRecords
                .filter(
                  (el) =>
                    formatTimestampToMMDDYY(el.sleepStart) === day.date ||
                    formatTimestampToMMDDYY(el.sleepEnd) === day.date
                ) // Filter records matching the current day
                .map((el, index) => (
                  <Text key={index}>
                    {` Sleep from ${formatTimestampToMMDDYY(
                      el.sleepStart
                    )} to ${formatTimestampToMMDDYY(el.sleepEnd)} `}
                  </Text>
                ))}
            </Text>
            <Text style={styles.dayDetail}>
              Diaper Changes:
              {diaperChanges
                .filter((el) => el.date === day.date)
                .map((el) => (
                  <Text>
                    {el.type} at {el.time},
                  </Text>
                ))}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    padding: 15,
  },
  scrollContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "#e4e7eb",
    borderRadius: 10,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28436d",
    marginVertical: 20,
    textAlign: "center",
  },
  dayContainer: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
  dayDetail: {
    fontSize: 16,
    color: "#444",
    marginTop: 5,
  },
})

export default WeeklyReport
