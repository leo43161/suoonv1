import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'

const Card = ({ children, additionalStyle, onPress, key }) => {
    return onPress ? (
        <Pressable key={key} onPress={onPress} style={[styles.card, additionalStyle]}>
            {children}
        </Pressable>
    ) : (
        <View key={key} style={[styles.card, additionalStyle]}>
            {children}
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: "white",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})