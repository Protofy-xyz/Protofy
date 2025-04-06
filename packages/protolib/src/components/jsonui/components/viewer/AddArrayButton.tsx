import { Cross, Plus, PlusCircle, PlusSquare } from "@tamagui/lucide-icons"
import { useState, useEffect } from "react"
import { XStack } from "@my/ui"
import LabelAndValue from "./LabelAndValue"

export const AddArrayButton = ({ onAdd = () => { } }) => {
    return <XStack onPress={() => {
        onAdd()
    }} hoverStyle={{ opacity: 1 }} opacity={0.2}>
        <Cross color={"var(--color9)"} size={16} />
    </XStack>
}