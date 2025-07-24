
// data contains: data.icon, data.color, data.name, data.params
return card({
    content: `
        ${cardIcon({ data, size: '48' })}
        ${cardAction({ data })}
    `
});
