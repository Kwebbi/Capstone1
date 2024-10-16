import React, { useEffect, useState, useCallback } from "react"
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

    const formattedDate = `${day}/${month}/${year}`

    lastWeekDates.push({
      date,
      label: formattedDate,
      dayName: date.toLocaleString("default", { weekday: "long" }),
    })
  }

  return lastWeekDates.reverse()
}

const formatTimestampToDDMMYY = (timestamp) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
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

  const fetchData = useCallback(() => {
    const allFeedingTimesQuery = query(feedingTimeRef, orderByChild("dateTime"))
    onValue(allFeedingTimesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const feedingsArray = Object.values(snapshot.val()).filter(
          (feeding) => feeding.babyID === babyID
        )
        setFeedings(feedingsArray)
      } else {
        setFeedings([])
      }
    })

    onValue(diaperChangeRef, (snapshot) => {
      if (snapshot.exists()) {
        const diaperChangesArray = Object.values(snapshot.val()).filter(
          (change) => change.babyID === babyID
        )
        setDiaperChanges(diaperChangesArray)
      } else {
        setDiaperChanges([])
      }
    })

    onValue(sleepTimeRef, (snapshot) => {
      if (snapshot.exists()) {
        const sleepArray = Object.values(snapshot.val()).filter(
          (sleep) => sleep.babyID === babyID
        )
        setSleepRecords(sleepArray)
      } else {
        setSleepRecords([])
      }
    })
  }, [babyID])

  const prepareDailyReports = useCallback(() => {
    const lastWeekDates = getLastWeekDates()

    const reports = lastWeekDates.map((day) => ({
      date: day.label,
      dayName: day.dayName,
      feeding: feedings.filter((f) => f.feedingDate === day.label),
      diapers: diaperChanges.filter((d) => d.date === day.label),
      sleep: sleepRecords.filter(
        (s) =>
          formatTimestampToDDMMYY(s.sleepStart) === day.label ||
          formatTimestampToDDMMYY(s.sleepEnd) === day.label
      ),
    }))

    setDailyReports(reports)
  }, [feedings, diaperChanges, sleepRecords])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    prepareDailyReports()
  }, [feedings, diaperChanges, sleepRecords, prepareDailyReports])

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
              Feeding: {""}
              {day.feeding.length > 0 ? (
                day.feeding.map((el, idx) => (
                  <Text key={idx}>
                    {el.foodChoice} {el.feedingAmount} ml at {el.feedingTime}, {""}
                  </Text>
                ))
              ) : (
                <Text> No feeding data </Text>
              )}
            </Text>

            <Text style={styles.dayDetail}>
              Sleep Records: {""}
              {day.sleep.length > 0 ? (
                day.sleep.map((el, idx) => (
                  <Text key={idx}>
                    {`Sleep from ${formatTimestampToDDMMYY(
                      el.sleepStart
                    )} to ${formatTimestampToDDMMYY(el.sleepEnd)}`}
                    {""}
                  </Text>
                ))
              ) : (
                <Text> No sleep data </Text>
              )}
            </Text>

            <Text style={styles.dayDetail}>
              Diaper Changes: {""}
              {day.diapers.length > 0 ? (
                day.diapers.map((el, idx) => (
                  <Text key={idx}>
                    {el.type} at {el.time}, {""}
                  </Text>
                ))
              ) : (
                <Text> No diaper change data </Text>
              )}
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
    paddingLeft: 20,
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
