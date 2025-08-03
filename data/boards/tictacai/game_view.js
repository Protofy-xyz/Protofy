//@card/react

function MatrixTable({ data }) {
  const rows = Array.isArray(data) ? data : []
  const maxCols = rows.reduce((m, r) => Math.max(m, Array.isArray(r) ? r.length : 0), 0)

  const wrapStyle = {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  }
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    height: '100%',
  }
  const cellStyle = {
    border: '1px solid #ccc',
    padding: '6px 8px',
    textAlign: 'center',
  }

  return (
    <div style={wrapStyle}>
      <table style={tableStyle}>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {Array.from({ length: maxCols }).map((_, cIdx) => {
                const v = Array.isArray(row) ? row[cIdx] : undefined
                const text = v == null ? '' : String(v)
                return <td key={cIdx} style={cellStyle}><CardValue value={text ?? ""} /></td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Widget(card) {
  const value = card.value;
  const isMatrix = Array.isArray(value) && value.every(r => Array.isArray(r));
  const fullHeight = value !== undefined && typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean";

  const content = (
    <YStack f={1} h="100%" miH={0} mt={fullHeight ? "20px" : "0px"} ai="stretch" jc="flex-start" width="100%">
      {card.icon && card.displayIcon !== false && (
        <Icon name={card.icon} size={48} color={card.color} />
      )}

      {card.displayResponse !== false && (
        isMatrix ? (
          <YStack f={1} miH={0} width="100%">
            <MatrixTable data={value} />
          </YStack>
        ) : (
          <YStack f={1} miH={0} width="100%"><h1>{value !== undefined ? String(value) : 'Empty table'}</h1></YStack>
        )
      )}
    </YStack>
  );

  return (
    <Tinted>
      <ProtoThemeProvider forcedTheme={window.TamaguiTheme}>
        <ActionCard data={card} style={{ height: '100%'}}>
          {content}
        </ActionCard>
      </ProtoThemeProvider>
    </Tinted>
  );
}