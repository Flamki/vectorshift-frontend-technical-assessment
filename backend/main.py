from collections import deque
import os
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

DEFAULT_CORS_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

cors_origins_raw = os.getenv('CORS_ORIGINS', '')
cors_origins = [
    origin.strip()
    for origin in cors_origins_raw.split(',')
    if origin.strip()
] or DEFAULT_CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r'https://.*\.vercel\.app',
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]] = Field(default_factory=list)
    edges: List[Dict[str, Any]] = Field(default_factory=list)


class PipelineParseResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def check_is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    node_ids = [str(node.get('id')) for node in nodes if node.get('id') is not None]
    adjacency = {node_id: set() for node_id in node_ids}
    indegree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')

        if source is None or target is None:
            return False

        source_id = str(source)
        target_id = str(target)

        if source_id not in adjacency:
            adjacency[source_id] = set()
            indegree[source_id] = 0

        if target_id not in adjacency:
            adjacency[target_id] = set()
            indegree[target_id] = 0

        if target_id not in adjacency[source_id]:
            adjacency[source_id].add(target_id)
            indegree[target_id] += 1

    queue = deque(node_id for node_id, degree in indegree.items() if degree == 0)
    visited_count = 0

    while queue:
        node_id = queue.popleft()
        visited_count += 1

        for neighbor in adjacency[node_id]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(adjacency)


@app.get('/')
def read_root() -> Dict[str, str]:
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse', response_model=PipelineParseResponse)
def parse_pipeline(payload: PipelinePayload) -> PipelineParseResponse:
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_dag = check_is_dag(payload.nodes, payload.edges)

    return PipelineParseResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag,
    )
