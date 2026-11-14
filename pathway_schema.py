"""Shared node builder helper for curated clinical pathways."""

from typing import Any, Dict, List, Optional


def node(
    step_num: int,
    stage: str,
    title: str,
    detail: str,
    node_type: str = "mechanism",
    branches: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, Any]:
    item: Dict[str, Any] = {
        "step_num": step_num,
        "stage": stage,
        "title": title,
        "detail": detail,
        "node_type": node_type,
    }
    if branches:
        item["branches"] = branches
    return item
