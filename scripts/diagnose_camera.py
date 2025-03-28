from pygrabber.dshow_graph import FilterGraph

graph = FilterGraph()
for i, name in enumerate(graph.get_input_devices()):
    print(f"[{i}] {name}")