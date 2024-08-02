<?php
if ( $args['products'] ) {
    echo '<table>';
    echo '<tr><th>Product Name</th><th>Price</th><th>Stock Quantity</th></tr>';
    foreach ( $args['products'] as $product_id ) {
        $product = wc_get_product($product_id);    
        // Output product information in table row
        echo '<tr>';
        echo '<td><a href="' . esc_url( $product->get_permalink() ) . '">' . esc_html( $product->get_name() ) . '</a></td>';
        echo '<td>' . wp_kses_post( $product->get_price_html() ) . '</td>';
        echo '<td>' . esc_html( $product->get_stock_quantity() ) . '</td>';
        echo '</tr>';
    }
    echo '</table>';
} else {
    echo 'No wholesale products found.';
}