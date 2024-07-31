from server.models.option import Option


def get_dict_key(option: Option) -> str:
    strike = option.strike
    right = option.call_put
    expiration_date = option.expiration_date.strftime('%Y-%m-%d')
    symbol = option.stock_symbol
    key = f"{strike}_{right}_{expiration_date}_{symbol}"
    return key


def get_closest_strike(index_price, bp_size):
    return round(index_price / bp_size) * bp_size
