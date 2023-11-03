import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'

export default {
    component: ({workspace, pageState, sourceUrl, initialItems, itemData, pageSession}:any) => {
        return (<AdminPage title="Device Cores" workspace={workspace} pageSession={pageSession}>
            <div>Device cores administration</div>
            {/* <DataView
                itemData={itemData}
                rowIcon={User}
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="user"
                onAdd={data => {
                    if(data.password != data.repassword) {
                        throw "Passwords do not match"
                    }
                    const {repassword, ...finalData} = data
                    return finalData
                }}
                onEdit={data => {
                    if(data.password != data.repassword) {
                        throw "Passwords do not match"
                    }
                    const {repassword, ...finalData} = data
                    return finalData
                }}

                columns={DataTable2.columns(
                    DataTable2.column("email", "username", true),
                    DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5':'$gray5'} />),
                    DataTable2.column("from", "from", true, row => <Chip text={row.from?.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$gray5'} />),
                    DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                    DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                )}
                extraFieldsForms={{ 
                    repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret().display()
                }}
                model={UserModel} 
                pageState={pageState}
                icons={UserIcons}
                dataTableGridProps={{itemMinWidth: 300, spacing:20}}
            /> */}
        </AdminPage>)
    }, 
    getServerSideProps: PaginatedDataSSR('/adminapi/v1/devicecores')
}