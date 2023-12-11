const Unknown = (props) => {
    return (
        <>
            Unknown
            {props.children}
        </>
    )
}

const UnknownSettings = () => {
    return (
        <div>
        </div>
    )
};

Unknown.craft = {
    props: {},
    related: {
        settings: UnknownSettings
    }
}

export default Unknown