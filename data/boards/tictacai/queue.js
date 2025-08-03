if (params.action == 'reset') {
    return [];
} else if (params.action == 'pop') {
    return (Array.isArray(board?.[name]) ? board?.[name] : []).slice(1);
} else if (params.action == 'remove') {
    const queue = Array.isArray(board?.[name]) ? board[name] : [];
    const index = parseInt(params.index, 10);
    return queue.slice(0, index).concat(queue.slice(index + 1));
} else if(params.action == 'clear') {
    return []
} else {
    return (Array.isArray(board?.[name]) ? board?.[name] : []).concat([params.item]);
}