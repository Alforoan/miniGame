from django import template

register = template.Library()

@register.filter
def index(sequence, position):
    return sequence[position] if len(sequence) > position else None

@register.filter
def to(value, end):
    return range(value, end)