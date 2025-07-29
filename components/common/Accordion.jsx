import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../global/colors';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({
    title,
    data,
    additionalStyleContain,
    additionalStyleHeader,
}) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View>
            <TouchableOpacity activeOpacity={1} style={[styles.row, additionalStyleHeader]} onPress={toggleExpand}>
                <Text style={[styles.title, styles.font]}>{title}</Text>
                <FontAwesome5 name={expanded ? "angle-up" : "angle-down"} size={23} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.parentHr} />
            {expanded && <View style={[styles.child, additionalStyleContain]}>
                {data}
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "black",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        backgroundColor: "white",
    },
    parentHr: {
        height: 1,
        backgroundColor: "gray",
        width: '100%',
    },
    child: {
        padding: 10,
    },
});

export default Accordion;