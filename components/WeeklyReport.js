import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { ref, onValue } from "firebase/database"
import { database } from "../config/firebase"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

// Helper function to get the date range for the **last week** (Sunday to Saturday)
const getLastWeekDates = () => {
  const currentDate = new Date()
  const currentDay = currentDate.getDay()

  const lastSunday = new Date(currentDate)
  lastSunday.setDate(currentDate.getDate() - currentDay - 7)

  const lastSaturday = new Date(lastSunday)
  lastSaturday.setDate(lastSunday.getDate() + 6)

  const lastWeekDates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(lastSunday)
    date.setDate(lastSunday.getDate() + i)
    lastWeekDates.push({
      date,
      label: date.toLocaleDateString(), // Format: "MM/DD/YYYY"
      dayName: date.toLocaleString("default", { weekday: "long" }),
    })
  }
  return lastWeekDates
}

const WeeklyReport = ({ route }) => {
  const { fullName, babyID } = route.params
  const [dailyReports, setDailyReports] = useState([]) // State for storing data for each day of last week
  const [loading, setLoading] = useState(true) // Loading state
  const navigation = useNavigation()

  useEffect(() => {
    const lastWeekDates = getLastWeekDates() // Get dates for the entire last week (Sunday to Saturday)

    const initialDailyReports = lastWeekDates.map((day) => ({
      date: day.label,
      dayName: day.dayName,
      feeding: 0,
      sleep: 0,
      diapers: 0,
      reports: [],
      milestones: [],
    }))

    const reportsRef = ref(database, `babies/${babyID}/reports`)
    const milestonesRef = ref(database, `babies/${babyID}/milestone`)

    const unsubscribeReports = onValue(reportsRef, (reportSnapshot) => {
      if (reportSnapshot.exists()) {
        const reportData = reportSnapshot.val()

        Object.keys(reportData).forEach((key) => {
          const report = reportData[key]
          const reportDate = report.date

          const dayIndex = initialDailyReports.findIndex(
            (day) => day.date === reportDate
          )
          if (dayIndex !== -1) {
            initialDailyReports[dayIndex].feeding +=
              parseFloat(report.feeding) || 0
            initialDailyReports[dayIndex].sleep += parseFloat(report.sleep) || 0
            initialDailyReports[dayIndex].diapers +=
              parseInt(report.diapers) || 0
            initialDailyReports[dayIndex].reports.push({
              ...report,
              id: key, // Use the Firebase key as a unique identifier
            })
          }
        })
      }

      const unsubscribeMilestones = onValue(
        milestonesRef,
        (milestoneSnapshot) => {
          if (milestoneSnapshot.exists()) {
            const milestoneData = milestoneSnapshot.val()

            Object.keys(milestoneData).forEach((key) => {
              const milestone = milestoneData[key]
              const milestoneDate = milestone.date

              const dayIndex = initialDailyReports.findIndex(
                (day) => day.date === milestoneDate
              )
              if (dayIndex !== -1) {
                initialDailyReports[dayIndex].milestones.push({
                  ...milestone,
                  id: key, // Use the Firebase key as a unique identifier
                })
              }
            })
          }

          setDailyReports(initialDailyReports)
          setLoading(false) // Stop loading after both data sets are processed
        }
      )

      return () => unsubscribeMilestones()
    })

    return () => unsubscribeReports()
  }, [babyID])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{fullName}'s Report for Last Week</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {dailyReports.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text
                style={styles.dayTitle}
              >{`${day.dayName} (${day.date})`}</Text>
              <Text
                style={styles.dayDetail}
              >{`Total Feeding: ${day.feeding} mL`}</Text>
              <Text
                style={styles.dayDetail}
              >{`Total Sleep: ${day.sleep} hours`}</Text>
              <Text
                style={styles.dayDetail}
              >{`Total Diaper Changes: ${day.diapers}`}</Text>

              {day.reports.length > 0 ? (
                day.reports.map((report) => (
                  <View key={report.id} style={styles.reportDetail}>
                    <Text>{`• ${report.date} - Feeding: ${report.feeding} mL, Sleep: ${report.sleep} hrs, Diapers: ${report.diapers}`}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noReportText}>
                  No activities recorded for this day.
                </Text>
              )}

              {day.milestones.length > 0 && (
                <>
                  <Text style={styles.milestoneTitle}>Milestones:</Text>
                  {day.milestones.map((milestone) => (
                    <View key={milestone.id} style={styles.milestoneDetail}>
                      <Text>{`• ${milestone.title} - ${milestone.description}`}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

export default WeeklyReport
