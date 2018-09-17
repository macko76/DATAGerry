import calendar
import datetime
import re
import ast

try:
    import uuid

    _use_uuid = True
except ImportError:
    _use_uuid = False

from bson.dbref import DBRef
from bson.max_key import MaxKey
from bson.min_key import MinKey
from bson.objectid import ObjectId
from bson.timestamp import Timestamp
from bson.tz_util import utc

_RE_TYPE = type(re.compile("foo"))


def convert_form_data(data: dict) -> dict:
    buf_dict = {}
    for k, v in data.items():
        b = form_converter(k, v)
        buf_dict.update(b)
    return buf_dict


def form_converter(k, v) -> dict:
    dict_buffer = {}
    if v is None:
        dict_buffer.update({k: None})
    if v == "on":
        dict_buffer.update({k: True})
    else:
        try:
            converted = ast.literal_eval(v)
            dict_buffer.update({k: converted})
        except Exception:
            dict_buffer.update({k: v})
    return dict_buffer


def object_hook(dct: dict):
    """Helper function for converting json to mongo bson
    Args:
        dct: json data

    Returns:
        bson json format
    """
    if "$oid" in dct:
        return ObjectId(str(dct["$oid"]))
    if "$ref" in dct:
        return DBRef(dct["$ref"], dct["$id"], dct.get("$db", None))
    if "$date" in dct:
        return datetime.datetime.fromtimestamp(float(dct["$date"]) / 1000.0,
                                               utc)
    if "$regex" in dct:
        flags = 0
        if "i" in dct["$options"]:
            flags |= re.IGNORECASE
        if "m" in dct["$options"]:
            flags |= re.MULTILINE
        return re.compile(dct["$regex"], flags)
    if "$minKey" in dct:
        return MinKey()
    if "$maxKey" in dct:
        return MaxKey()
    if _use_uuid and "$uuid" in dct:
        return uuid.UUID(dct["$uuid"])
    return dct


def default(obj):
    """Helper function for converting bson to json
        Args:
            obj: bson data

        Returns:
            json format
        """
    if isinstance(obj, ObjectId):
        return {"$oid": str(obj)}
    if isinstance(obj, DBRef):
        return obj.as_doc()
    if isinstance(obj, datetime.datetime):
        if obj.utcoffset() is not None:
            obj = obj - obj.utcoffset()
        millis = int(calendar.timegm(obj.timetuple()) * 1000 +
                     obj.microsecond / 1000)
        return {"$date": millis}
    if isinstance(obj, _RE_TYPE):
        flags = ""
        if obj.flags & re.IGNORECASE:
            flags += "i"
        if obj.flags & re.MULTILINE:
            flags += "m"
        return {"$regex": obj.pattern,
                "$options": flags}
    if isinstance(obj, MinKey):
        return {"$minKey": 1}
    if isinstance(obj, MaxKey):
        return {"$maxKey": 1}
    if isinstance(obj, Timestamp):
        return {"t": obj.time, "i": obj.inc}
    if _use_uuid and isinstance(obj, uuid.UUID):
        return {"$uuid": obj.hex}
    raise TypeError("%r is not JSON serializable" % obj)