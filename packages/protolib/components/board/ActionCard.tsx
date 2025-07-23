import { useState } from "react";
import { CardValue } from "./CardValue";
import { XStack, YStack, Text } from "@my/ui";

const Icon = ({ name, size, color, style }) => {
    return (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `${color}`,
                maskImage: `url(/public/icons/${name}.svg)`,
                WebkitMaskImage: `url(/public/icons/${name}.svg)`,
                maskRepeat: `no-repeat`,
                WebkitMaskRepeat: `no-repeat`,
                maskSize: `contain`,
                WebkitMaskSize: `contain`,
                maskPosition: `center`,
                WebkitMaskPosition: `center`,
                ...style,
            }}
        />
    );
};

export const ParamsForm = ({ data, children }) => {
    const allKeys = Object.keys(data.params || {});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await window["executeAction"](e, data.name);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <YStack w={"100%"} ai="center" jc="center" f={1}>

                {children}
                <YStack w={"100%"} ai="center" jc="center" mt={data.buttonMode !== "full" ? "$5": 0}>
                    {allKeys.map((key) => {
                        const cfg = data.configParams?.[key] || {};
                        const { visible = true, defaultValue = "" } = cfg;
                        const placeholder = data.params[key] ?? "";

                        if (!visible) {
                            return (
                                <input
                                    key={key}
                                    type="hidden"
                                    name={key}
                                    defaultValue={defaultValue}
                                />
                            );
                        }

                        return (
                            <YStack
                                key={key}
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    flexDirection: "column",
                                }}
                            >
                                <Text ml="20px" mb="$2">{key}</Text>
                                <input
                                    className="no-drag"
                                    type="text"
                                    name={key}
                                    style={{
                                        backgroundColor: "var(--gray1)",
                                        flex: 1,
                                        padding: "5px 10px",
                                        border: "0.5px solid var(--gray7)",
                                        borderRadius: "8px",
                                        boxSizing: "border-box",
                                        minWidth: "100px",
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                    }}
                                    defaultValue={defaultValue}
                                    placeholder={placeholder}
                                />
                            </YStack>
                        );
                    })}
                </YStack>


                {data.type === "action" && (
                    <YStack w={"100%"} {...(data.buttonMode === "full" ? { f: 1 } : {})} ai="center" jc="center" padding={data.buttonMode !== "full" ? "10px" : "0"}>
                        <button
                            id={`${data.name}-run-button`}
                            className="no-drag"
                            type="submit"
                            style={{
                                ...(data.buttonMode === "full" ? { height: "100%", } : {}),
                                ...(data.buttonMode !== "full" ? { marginLeft: "10px" } : {}),
                                ...(data.buttonMode !== "full" ? { marginRight: "10px" } : {}),
                                width: "100%",
                                maxWidth: "100%",
                                ...(data.buttonMode === "full" ? { flex: 1 } : {}),
                                ...(data.buttonMode !== "full" ? { marginTop: "5px" } : {}),
                                display: "flex",
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: data.color,
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "filter 0.2s ease-in-out",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.filter = "none")}
                            onMouseDown={(e) =>
                            (e.currentTarget.style.filter =
                                "saturate(1.2) contrast(1.2) brightness(0.85)")
                            }
                            onMouseUp={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
                        >
                            <span
                                style={{
                                    color: data.color,
                                    filter: "brightness(0.5)",
                                    fontWeight: 400,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                }}
                            >
                                {data.icon && data.displayIcon !== false && data.buttonMode === 'full' && (
                                    <Icon
                                        name={data.icon}
                                        size={48}
                                        color={data.color}
                                        style={{ marginLeft: "5px" }}
                                    />
                                )}
                                {loading ? "..." : data.buttonLabel || "Run"}
                            </span>
                        </button>
                    </YStack>

                )}
            </YStack>
        </form>
    );
};

export const ActionCard = ({ data }) => {
    const value = data.value;
    const fullHeight =
        value !== undefined &&
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean";


    const valueComp = <YStack f={fullHeight ? 1 : undefined}  mt={fullHeight ? "$4" : "$0"} ai="center" jc="center" width="100%">
        {data.icon && data.displayIcon !== false && (
            <Icon
                name={data.icon}
                size={48}
                color={data.color}
            />
        )}
        {data.displayResponse !== false && (
            <CardValue value={value ?? "N/A"} />
        )}
    </YStack>
    return (
        <YStack height="100%" justifyContent="center" alignItems="center" className="no-drag">

            {data.displayButton !== false ? <ParamsForm data={data}>{valueComp}</ParamsForm> : data.displayResponse !== false && valueComp}
        </YStack>
    );
};