<?php

namespace CatalogEnquiry\Wholesale;

class Rest {
    /**
     * Rest class constructor functions
     */
    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_rest_api' ] );
    }

    /**
     * Regsiter restapi
     * @return void
     */
    public function register_rest_api() {
        register_rest_route ( Catalog()->rest_namespace, '/get-user-table-segment', [ 
            'methods'               => \WP_REST_Server::ALLMETHODS,
            'callback'              => [ $this, 'get_user_table_segment' ],
            'permission_callback'   => [ Catalog()->restapi, 'catalog_permission' ],
        ] );

        register_rest_route( Catalog()->rest_namespace, '/get-wholesale-users', [
            'callback'              => [ $this, 'get_wholesale_users' ],
            'methods'               => \WP_REST_Server::ALLMETHODS,
            'permission_callback'   => [ Catalog()->restapi, 'catalog_permission' ]
        ] );

        register_rest_route( Catalog()->rest_namespace, '/wholesale-user-action', [
            'methods'               => \WP_REST_Server::ALLMETHODS,
            'callback'              => [ $this, 'wholesale_user_action' ],
            'permission_callback'   => [ Catalog()->restapi, 'catalog_permission' ]
        ] );

        register_rest_route( Catalog()->rest_namespace, '/wholesale-register', [
            'methods'               => \WP_REST_Server::ALLMETHODS,
            'callback'              => [ Fontend::class, 'wholesale_register' ],
            'permission_callback'   => [ Catalog()->restapi, 'catalog_permission' ]
        ] );
    }

    /**
     * Get the wholesale users
     * @param mixed $request
     * @return \WP_Error|\WP_REST_Response
     */
    public static function get_wholesale_users( $request ) {

        // Request object's filter data for pagination
        $counts 	 = $request->get_param( 'counts' );
        $limit       = $request['row'];
        $offset      = ( $request['page'] - 1 ) * $limit;
        
        // Date filter data
        $start_date     = sanitize_text_field( $request['start_date'] );
        $end_date       = sanitize_text_field( $request[ 'end_date' ] );

        $all_status     = ['pending', 'approve', 'reject'];
        $status         = $request['status'];
        
        $meta_query[] = [
            'key'       => 'wholesale_customer_status',
            'value'     => $status && $status !== 'all' ? [$status] : $all_status,
            'compare'   => 'IN'
        ];
        
        // Create user query
        $customer_query = new \WP_User_Query([
            'number' => $limit,
            'offset' => $offset,
            'date_query'    => [
                'after'     => $start_date,
                'before'    => $end_date,
                'inclusive' => true,
            ],
            'meta_query' => $meta_query,
        ]);
        
        // Get the customers
        $customers = $customer_query->get_results();
        
        // Prepare user list
        $user_list = [];
        foreach ( $customers as $customer ) {
            $user_list[] = apply_filters( 'catalog_wholesale_users_list_data', [
                'id'        => $customer->ID,
                'customer'  => $customer->display_name,
                'customer_url'  => esc_url( get_edit_user_link( $customer->ID ) ),
                'customer_img_url'  => esc_url( get_avatar_url( $customer->ID ) ),
                'email'     => $customer->user_email,
                'status'    => get_user_meta( $customer->ID, 'wholesale_customer_status', true ),
                'date'      => date_i18n( 'Y/m/d \a\t g:i a', strtotime( $customer->user_registered ) ),
                'additional_info'   => unserialize(get_user_meta( $customer->ID, 'wholesale_additonal_fields', true )),
            ], $customer );
        }
        
        if ( $counts ) {
            return rest_ensure_response( count( $user_list ) );
        }
        
        return rest_ensure_response ( $user_list );
    }

    /**
     * Get the table segments for wholesale user table
     * @return \WP_Error|\WP_REST_Response
     */
    public function get_user_table_segment( $request ) {
        $statuses      = [ 'pending', 'approve', 'reject' ];
        $segment_count = [];
        $all = 0;
        
        // Loop through each status and count the users
        foreach ( $statuses as $status_type ) {
            $user_query = new \WP_User_Query([
                'meta_query' => [
                    [
                        'key'     => 'wholesale_customer_status',
                        'value'   => $status_type,
                        'compare' => '='
                    ]
                ],
                'fields' => 'ID'
            ]);
            
            $segment_count[ $status_type ] = $user_query->get_total();
            $all += $segment_count[ $status_type ];
        }
        
        // Add the total count of all users
        $segment_count[ 'all' ] = $all;
        
        // Return the results
        return rest_ensure_response( $segment_count );
    }

    /**
     * Handleer function for wholesale user action
     * @param mixed $request
     * @return \WP_Error|\WP_REST_Response
     */
    public function wholesale_user_action( $request ) {
        // Get the user id and action to perform
        $user_id = $request->get_param( 'id' );
        $action  = $request->get_param( 'action' );

        if ( $action == 'approve' ) {
            Util::approve_wholesale_user( $user_id );
        }

        if ( $action == 'reject' ) {
            Util::reject_wholesale_user( $user_id );
        }

        return rest_ensure_response( true );
    }
}
